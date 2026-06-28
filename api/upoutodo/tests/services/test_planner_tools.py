from datetime import timedelta

import pytest
from django.utils import timezone

from upoutodo.models import EnergyCheckIn, PlanItem, TodayPlanFeedback
from upoutodo.services import planner_tools
from upoutodo.tests.factories import ProjectFactory, TaskFactory, UserFactory


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def section(user):
    project = ProjectFactory(created_by=user, updated_by=user)
    return project.sections.first()


@pytest.mark.django_db
def test_planner_tool_definitions_are_structured_operations():
    definitions = planner_tools.get_planner_tool_definitions()
    names = [definition.name for definition in definitions]

    assert names == [
        "get_today_plan",
        "submit_check_in",
        "rebuild_today_plan",
        "accept_suggestion",
        "snooze_suggestion",
        "dismiss_suggestion",
        "submit_plan_feedback",
    ]
    assert all(
        definition.input_schema["type"] == "object" for definition in definitions
    )
    assert definitions[0].mutates_state is False
    assert {
        definition.name for definition in definitions[1:] if definition.mutates_state
    } == {
        "submit_check_in",
        "rebuild_today_plan",
        "accept_suggestion",
        "snooze_suggestion",
        "dismiss_suggestion",
        "submit_plan_feedback",
    }
    snooze_definition = next(
        definition
        for definition in definitions
        if definition.name == "snooze_suggestion"
    )
    assert snooze_definition.input_schema["properties"]["minutes"] == {
        "type": "integer",
        "minimum": 1,
        "maximum": 10080,
    }


@pytest.mark.django_db
def test_submit_check_in_tool_rebuilds_user_plan(section, user):
    for index in range(3):
        TaskFactory(
            section=section,
            title=f"Tool task {index}",
            due_date=timezone.now(),
        )

    plan = planner_tools.submit_check_in(
        user,
        planner_tools.PlannerCheckInInput(
            energy_level=EnergyCheckIn.EnergyLevel.LOW,
            available_minutes=30,
            focus_mode=EnergyCheckIn.FocusMode.LIGHT,
            context="Short window before class",
        ),
    )

    plan.refresh_from_db()
    assert plan.user == user
    assert plan.check_in.energy_level == EnergyCheckIn.EnergyLevel.LOW
    assert plan.check_in.available_minutes == 30
    assert plan.check_in.context == "Short window before class"
    assert plan.items.count() == 1
    assert plan.items.first().estimated_minutes == 25


@pytest.mark.django_db
def test_suggestion_tool_actions_mutate_only_owned_plan_items(section, user):
    TaskFactory(section=section, title="Owned planner task", due_date=timezone.now())
    plan = planner_tools.get_today_plan(user)
    item = plan.items.first()

    accepted = planner_tools.accept_suggestion(user, item.id)
    assert accepted.status == PlanItem.Status.ACCEPTED
    assert accepted.accepted_at is not None

    snoozed = planner_tools.snooze_suggestion(user, item.id, minutes=45)
    assert snoozed.status == PlanItem.Status.SNOOZED
    assert snoozed.snoozed_until is not None
    assert snoozed.snoozed_until > timezone.now() + timedelta(minutes=40)

    dismissed = planner_tools.dismiss_suggestion(user, item.id)
    assert dismissed.status == PlanItem.Status.DISMISSED
    assert dismissed.dismissed_at is not None

    foreign_user = UserFactory()
    with pytest.raises(planner_tools.PlannerToolObjectNotFound):
        planner_tools.accept_suggestion(foreign_user, item.id)

    with pytest.raises(planner_tools.PlannerToolObjectNotFound):
        planner_tools.snooze_suggestion(foreign_user, item.id, minutes=60)

    with pytest.raises(planner_tools.PlannerToolObjectNotFound):
        planner_tools.dismiss_suggestion(foreign_user, item.id)

    with pytest.raises(planner_tools.PlannerToolObjectNotFound):
        planner_tools.accept_suggestion(user, "not-a-suggestion-id")


@pytest.mark.django_db
def test_submit_plan_feedback_tool_upserts_current_user_plan(section, user):
    TaskFactory(section=section, title="Feedback task", due_date=timezone.now())
    plan = planner_tools.get_today_plan(user)

    feedback = planner_tools.submit_plan_feedback(
        user,
        planner_tools.PlannerFeedbackInput(
            helpfulness_rating=4,
            confidence_rating=5,
            note="The tool plan was useful.",
        ),
    )

    assert feedback.user == user
    assert feedback.plan == plan
    assert feedback.helpfulness_rating == 4
    assert feedback.confidence_rating == 5
    assert feedback.note == "The tool plan was useful."

    updated_feedback = planner_tools.submit_plan_feedback(
        user,
        planner_tools.PlannerFeedbackInput(
            helpfulness_rating=5,
            confidence_rating=4,
            note="Updated after review.",
        ),
    )

    assert updated_feedback.id == feedback.id
    assert TodayPlanFeedback.objects.count() == 1
    feedback.refresh_from_db()
    assert feedback.helpfulness_rating == 5
    assert feedback.confidence_rating == 4
    assert feedback.note == "Updated after review."
