from io import StringIO

import pytest
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.utils import timezone

from upoutodo.management.commands.seed_planner_evaluation_demo import (
    DEMO_PROJECT_TITLE,
    DEMO_USERNAME,
)
from upoutodo.models import (
    EnergyCheckIn,
    PlanItem,
    Project,
    Task,
    TodayPlan,
    TodayPlanFeedback,
)

User = get_user_model()


@pytest.mark.django_db
def test_seed_planner_evaluation_demo_creates_walkthrough_dataset():
    output = StringIO()

    call_command("seed_planner_evaluation_demo", stdout=output)

    user = User.objects.get(username=DEMO_USERNAME)
    assert user.email == "planner-demo@example.test"
    assert user.profile.name == "Demo Faculty"
    assert user.profile.is_faculty is True
    assert user.profile.is_student is False
    assert user.profile.is_onboarded is True

    project = Project.objects.get(created_by=user, title=DEMO_PROJECT_TITLE)
    assert set(project.sections.values_list("title", flat=True)) >= {
        "Teaching",
        "Admin",
        "Research",
    }
    assert Task.objects.filter(section__project=project).count() == 6

    check_in = EnergyCheckIn.objects.get(user=user, date=timezone.localdate())
    assert check_in.energy_level == EnergyCheckIn.EnergyLevel.LOW
    assert check_in.available_minutes == 90
    assert check_in.focus_mode == EnergyCheckIn.FocusMode.LIGHT

    plan = TodayPlan.objects.get(user=user, date=timezone.localdate())
    assert plan.items.count() == 3
    assert set(plan.items.values_list("status", flat=True)) == {
        PlanItem.Status.SUGGESTED
    }
    assert TodayPlanFeedback.objects.filter(plan=plan).exists() is False
    assert "Seeded planner evaluation demo" in output.getvalue()


@pytest.mark.django_db
def test_seed_planner_evaluation_demo_is_idempotent():
    call_command("seed_planner_evaluation_demo", stdout=StringIO())
    call_command("seed_planner_evaluation_demo", stdout=StringIO())

    user = User.objects.get(username=DEMO_USERNAME)
    project = Project.objects.get(created_by=user, title=DEMO_PROJECT_TITLE)

    assert (
        Project.objects.filter(created_by=user, title=DEMO_PROJECT_TITLE).count() == 1
    )
    assert Task.objects.filter(section__project=project).count() == 6
    assert TodayPlan.objects.filter(user=user, date=timezone.localdate()).count() == 1


@pytest.mark.django_db
def test_seed_planner_evaluation_demo_can_include_sample_outcomes():
    call_command(
        "seed_planner_evaluation_demo",
        "--include-outcomes",
        stdout=StringIO(),
    )

    user = User.objects.get(username=DEMO_USERNAME)
    plan = TodayPlan.objects.get(user=user, date=timezone.localdate())
    statuses = set(plan.items.values_list("status", flat=True))

    assert PlanItem.Status.ACCEPTED in statuses
    assert PlanItem.Status.SNOOZED in statuses
    assert PlanItem.Status.DISMISSED in statuses

    feedback = TodayPlanFeedback.objects.get(plan=plan)
    assert feedback.helpfulness_rating == 4
    assert feedback.confidence_rating == 4


@pytest.mark.django_db
def test_seed_planner_evaluation_demo_reset_removes_stale_demo_data():
    call_command("seed_planner_evaluation_demo", stdout=StringIO())
    user = User.objects.get(username=DEMO_USERNAME)
    project = Project.objects.get(created_by=user, title=DEMO_PROJECT_TITLE)
    section = project.sections.get(title="Teaching")
    Task.objects.create(section=section, title="Stale demo task")

    call_command("seed_planner_evaluation_demo", "--reset", stdout=StringIO())

    user.refresh_from_db()
    project = Project.objects.get(created_by=user, title=DEMO_PROJECT_TITLE)
    assert Task.objects.filter(section__project=project).count() == 6
    assert Task.objects.filter(title="Stale demo task").exists() is False
