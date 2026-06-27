from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.models import EnergyCheckIn, PlanItem, Task, TodayPlan, TodayPlanFeedback
from upoutodo.tests.factories import ProjectFactory, TaskFactory, UserFactory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def admin_user():
    user = UserFactory()
    user.profile.is_admin = True
    user.profile.save(update_fields=["is_admin"])
    return user


@pytest.fixture
def admin_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture
def section(user):
    project = ProjectFactory(created_by=user, updated_by=user)
    return project.sections.first()


def task_titles(response):
    return [item["task"]["title"] for item in response.data["suggestions"]]


@pytest.mark.django_db
def test_today_builds_ranked_owned_suggestions(auth_client, section):
    overdue = TaskFactory(
        section=section,
        title="Overdue high priority",
        due_date=timezone.now() - timedelta(days=1),
        priority=Task.Priority.HIGH,
    )
    due_today = TaskFactory(
        section=section,
        title="Due today",
        due_date=timezone.now(),
        priority=Task.Priority.LOW,
    )
    TaskFactory(section=section, title="Backlog item", due_date=None)

    other_user = UserFactory()
    other_project = ProjectFactory(created_by=other_user, updated_by=other_user)
    TaskFactory(
        section=other_project.sections.first(),
        title="Foreign overdue task",
        due_date=timezone.now() - timedelta(days=2),
        priority=Task.Priority.HIGH,
    )

    response = auth_client.get("/api/planner/today/", format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["check_in"]["available_minutes"] == 120
    titles = task_titles(response)
    assert titles[0] == overdue.title
    assert due_today.title in titles
    assert "Foreign overdue task" not in titles
    assert response.data["suggestions"][0]["reason"].startswith("Overdue")


@pytest.mark.django_db
def test_today_suggestions_include_structured_task_signals(auth_client, section):
    section.title = "Assessments"
    section.save(update_fields=["title"])
    due_at = timezone.now() - timedelta(days=1)
    task = TaskFactory(
        section=section,
        title="Explainable suggestion",
        due_date=due_at,
        priority=Task.Priority.HIGH,
        rrule="FREQ=WEEKLY",
    )
    target_date = timezone.localdate()
    due_date = timezone.localtime(due_at).date()

    response = auth_client.get("/api/planner/today/", format="json")

    assert response.status_code == status.HTTP_200_OK
    suggestion = response.data["suggestions"][0]
    assert suggestion["task"]["id"] == task.id
    assert suggestion["signals"] == {
        "due_date": due_date.isoformat(),
        "due_status": "overdue",
        "due_label": f"Overdue {due_date.isoformat()}",
        "due_in_days": (due_date - target_date).days,
        "priority": Task.Priority.HIGH,
        "priority_label": "High",
        "estimated_minutes": 45,
        "is_recurring": True,
        "project_title": section.project.title,
        "section_title": "Assessments",
        "score": 140,
        "snoozed_count": 0,
        "dismissed_count": 0,
    }


@pytest.mark.django_db
def test_check_in_rebuilds_plan_with_available_time(auth_client, section):
    for index in range(3):
        TaskFactory(
            section=section,
            title=f"Due today {index}",
            due_date=timezone.now(),
            priority=Task.Priority.HIGH,
        )

    response = auth_client.post(
        "/api/planner/check-in/",
        {
            "energy_level": EnergyCheckIn.EnergyLevel.LOW,
            "available_minutes": 30,
            "focus_mode": EnergyCheckIn.FocusMode.LIGHT,
            "context": "Between meetings",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["check_in"]["energy_level"] == EnergyCheckIn.EnergyLevel.LOW
    assert response.data["check_in"]["available_minutes"] == 30
    assert response.data["check_in"]["context"] == "Between meetings"
    assert len(response.data["suggestions"]) == 1
    assert response.data["suggestions"][0]["estimated_minutes"] == 25


@pytest.mark.django_db
def test_suggestion_actions_update_status(auth_client, section):
    TaskFactory(section=section, due_date=timezone.now(), title="Actionable task")
    today_response = auth_client.get("/api/planner/today/", format="json")
    item_id = today_response.data["suggestions"][0]["id"]

    accept_response = auth_client.post(
        f"/api/planner/suggestions/{item_id}/accept/", format="json"
    )
    assert accept_response.status_code == status.HTTP_200_OK
    assert accept_response.data["status"] == PlanItem.Status.ACCEPTED
    assert accept_response.data["accepted_at"] is not None

    snooze_response = auth_client.post(
        f"/api/planner/suggestions/{item_id}/snooze/",
        {"minutes": 45},
        format="json",
    )
    assert snooze_response.status_code == status.HTTP_200_OK
    assert snooze_response.data["status"] == PlanItem.Status.SNOOZED
    assert snooze_response.data["snoozed_until"] is not None

    dismiss_response = auth_client.post(
        f"/api/planner/suggestions/{item_id}/dismiss/", format="json"
    )
    assert dismiss_response.status_code == status.HTTP_200_OK
    assert dismiss_response.data["status"] == PlanItem.Status.DISMISSED
    assert dismiss_response.data["dismissed_at"] is not None


@pytest.mark.django_db
def test_suggestion_actions_reject_foreign_plan_items(auth_client):
    other_user = UserFactory()
    other_project = ProjectFactory(created_by=other_user, updated_by=other_user)
    task = TaskFactory(section=other_project.sections.first(), due_date=timezone.now())
    check_in = EnergyCheckIn.objects.create(
        user=other_user, date=timezone.localdate(), available_minutes=60
    )
    plan = TodayPlan.objects.create(
        user=other_user,
        date=timezone.localdate(),
        check_in=check_in,
        generated_at=timezone.now(),
    )
    item = PlanItem.objects.create(plan=plan, task=task)

    response = auth_client.post(
        f"/api/planner/suggestions/{item.id}/accept/", format="json"
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_rebuild_preserves_dismissed_item(auth_client, section):
    task = TaskFactory(section=section, due_date=timezone.now(), title="Dismiss me")
    today_response = auth_client.get("/api/planner/today/", format="json")
    item_id = today_response.data["suggestions"][0]["id"]

    auth_client.post(f"/api/planner/suggestions/{item_id}/dismiss/", format="json")
    response = auth_client.post("/api/planner/rebuild/", format="json")

    assert response.status_code == status.HTTP_200_OK
    item = PlanItem.objects.get(id=item_id)
    assert item.task == task
    assert item.status == PlanItem.Status.DISMISSED


@pytest.mark.django_db
def test_check_in_rejects_invalid_available_minutes(auth_client):
    response = auth_client.post(
        "/api/planner/check-in/",
        {"available_minutes": 721},
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "available_minutes" in response.data


@pytest.mark.django_db
def test_feedback_upserts_current_today_plan_feedback(auth_client, user, section):
    TaskFactory(section=section, due_date=timezone.now(), title="Feedback task")
    today_response = auth_client.get("/api/planner/today/", format="json")
    plan_id = today_response.data["id"]
    assert today_response.data["feedback"] is None

    response = auth_client.post(
        "/api/planner/feedback/",
        {
            "helpfulness_rating": 4,
            "confidence_rating": 5,
            "note": "The plan made the next step clear.",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["helpfulness_rating"] == 4
    assert response.data["confidence_rating"] == 5
    assert response.data["note"] == "The plan made the next step clear."
    feedback = TodayPlanFeedback.objects.get()
    assert feedback.user == user
    assert feedback.plan_id == plan_id

    update_response = auth_client.post(
        "/api/planner/feedback/",
        {
            "helpfulness_rating": 5,
            "confidence_rating": 4,
            "note": "",
        },
        format="json",
    )

    assert update_response.status_code == status.HTTP_200_OK
    assert TodayPlanFeedback.objects.count() == 1
    feedback.refresh_from_db()
    assert feedback.helpfulness_rating == 5
    assert feedback.confidence_rating == 4
    assert feedback.note == ""

    updated_today_response = auth_client.get("/api/planner/today/", format="json")
    assert updated_today_response.data["feedback"]["id"] == feedback.id
    assert updated_today_response.data["feedback"]["helpfulness_rating"] == 5


@pytest.mark.django_db
def test_feedback_rejects_invalid_ratings(auth_client):
    response = auth_client.post(
        "/api/planner/feedback/",
        {
            "helpfulness_rating": 0,
            "confidence_rating": 6,
            "note": "Invalid",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "helpfulness_rating" in response.data
    assert "confidence_rating" in response.data
    assert TodayPlan.objects.count() == 0
    assert TodayPlanFeedback.objects.count() == 0


@pytest.mark.django_db
def test_planner_evaluation_requires_admin(auth_client):
    response = auth_client.get("/api/planner/evaluation/", format="json")

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_planner_evaluation_handles_empty_dataset(admin_client):
    response = admin_client.get("/api/planner/evaluation/", format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {
        "plan_count": 0,
        "feedback_count": 0,
        "feedback_response_rate": 0.0,
        "average_helpfulness_rating": None,
        "average_confidence_rating": None,
        "total_suggestions": 0,
        "suggestion_status_counts": {
            "suggested": 0,
            "accepted": 0,
            "snoozed": 0,
            "dismissed": 0,
            "done": 0,
        },
        "suggestion_action_rates": {
            "accepted": 0.0,
            "snoozed": 0.0,
            "dismissed": 0.0,
        },
    }


@pytest.mark.django_db
def test_planner_evaluation_returns_anonymized_aggregate_metrics(admin_client):
    first_user = UserFactory(
        username="private-first-user", email="private-first@example.test"
    )
    second_user = UserFactory(
        username="private-second-user", email="private-second@example.test"
    )
    third_user = UserFactory(
        username="private-third-user", email="private-third@example.test"
    )
    today = timezone.localdate()
    first_plan, first_section = create_plan_for_user(first_user, today)
    second_plan, second_section = create_plan_for_user(
        second_user, today - timedelta(days=1)
    )
    create_plan_for_user(third_user, today - timedelta(days=2))

    private_task = TaskFactory(
        section=first_section,
        title="Private planner task title",
        due_date=timezone.now(),
    )
    PlanItem.objects.create(
        plan=first_plan, task=private_task, status=PlanItem.Status.ACCEPTED
    )
    PlanItem.objects.create(
        plan=first_plan,
        task=TaskFactory(section=first_section, due_date=timezone.now()),
        status=PlanItem.Status.SNOOZED,
    )
    PlanItem.objects.create(
        plan=second_plan,
        task=TaskFactory(section=second_section, due_date=timezone.now()),
        status=PlanItem.Status.DISMISSED,
    )
    PlanItem.objects.create(
        plan=second_plan,
        task=TaskFactory(section=second_section, due_date=timezone.now()),
        status=PlanItem.Status.SUGGESTED,
    )
    TodayPlanFeedback.objects.create(
        user=first_user,
        plan=first_plan,
        helpfulness_rating=5,
        confidence_rating=4,
        note="Private feedback note",
    )
    TodayPlanFeedback.objects.create(
        user=second_user,
        plan=second_plan,
        helpfulness_rating=3,
        confidence_rating=5,
        note="Another private feedback note",
    )

    response = admin_client.get("/api/planner/evaluation/", format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {
        "plan_count": 3,
        "feedback_count": 2,
        "feedback_response_rate": 66.67,
        "average_helpfulness_rating": 4.0,
        "average_confidence_rating": 4.5,
        "total_suggestions": 4,
        "suggestion_status_counts": {
            "suggested": 1,
            "accepted": 1,
            "snoozed": 1,
            "dismissed": 1,
            "done": 0,
        },
        "suggestion_action_rates": {
            "accepted": 25.0,
            "snoozed": 25.0,
            "dismissed": 25.0,
        },
    }
    response_text = str(response.data)
    assert "Private planner task title" not in response_text
    assert "Private feedback note" not in response_text
    assert "private-first@example.test" not in response_text
    assert "private-first-user" not in response_text


@pytest.mark.django_db
def test_planner_requires_authentication(api_client):
    response = api_client.get("/api/planner/today/", format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_openapi_schema_documents_planner_contract(auth_client):
    response = auth_client.get("/api/schema/", HTTP_ACCEPT="application/json")

    assert response.status_code == status.HTTP_200_OK
    schema = response.data
    planner_paths = schema["paths"]
    assert (
        planner_paths["/api/planner/today/"]["get"]["responses"]["200"]["content"][
            "application/json"
        ]["schema"]["$ref"]
        == "#/components/schemas/TodayPlan"
    )
    assert (
        planner_paths["/api/planner/suggestions/{item_id}/accept/"]["post"][
            "responses"
        ]["200"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/PlanItem"
    )
    assert (
        planner_paths["/api/planner/suggestions/{item_id}/snooze/"]["post"][
            "requestBody"
        ]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/SnoozePlanItemRequest"
    )
    assert (
        planner_paths["/api/planner/feedback/"]["post"]["responses"]["200"]["content"][
            "application/json"
        ]["schema"]["$ref"]
        == "#/components/schemas/TodayPlanFeedback"
    )
    assert (
        planner_paths["/api/planner/feedback/"]["post"]["requestBody"]["content"][
            "application/json"
        ]["schema"]["$ref"]
        == "#/components/schemas/TodayPlanFeedbackRequest"
    )
    assert (
        planner_paths["/api/planner/evaluation/"]["get"]["responses"]["200"]["content"][
            "application/json"
        ]["schema"]["$ref"]
        == "#/components/schemas/PlannerEvaluationSummary"
    )
    e2e_scheme = schema["components"]["securitySchemes"]["E2ETestBearer"]
    assert e2e_scheme["type"] == "http"
    assert e2e_scheme["scheme"] == "bearer"
    assert e2e_scheme["bearerFormat"] == "E2E"
    signal_properties = schema["components"]["schemas"]["PlanItemSignals"]["properties"]
    assert (
        signal_properties["due_status"]["$ref"] == "#/components/schemas/DueStatusEnum"
    )
    assert signal_properties["priority_label"]["type"] == "string"
    assert signal_properties["snoozed_count"]["type"] == "integer"
    feedback_properties = schema["components"]["schemas"]["TodayPlanFeedback"][
        "properties"
    ]
    assert feedback_properties["helpfulness_rating"]["type"] == "integer"
    assert feedback_properties["confidence_rating"]["type"] == "integer"
    evaluation_properties = schema["components"]["schemas"]["PlannerEvaluationSummary"][
        "properties"
    ]
    assert evaluation_properties["feedback_response_rate"]["type"] == "number"
    assert evaluation_properties["suggestion_status_counts"]["$ref"] == (
        "#/components/schemas/PlannerSuggestionStatusCounts"
    )


def create_plan_for_user(user, target_date):
    project = ProjectFactory(created_by=user, updated_by=user)
    check_in = EnergyCheckIn.objects.create(
        user=user, date=target_date, available_minutes=90
    )
    plan = TodayPlan.objects.create(
        user=user,
        date=target_date,
        check_in=check_in,
        generated_at=timezone.now(),
    )
    return plan, project.sections.first()
