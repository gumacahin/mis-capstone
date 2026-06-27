from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.models import EnergyCheckIn, PlanItem, Task, TodayPlan
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
def test_planner_requires_authentication(api_client):
    response = api_client.get("/api/planner/today/", format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
