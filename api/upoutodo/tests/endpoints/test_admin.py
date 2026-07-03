import pytest
from django.contrib import admin
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.models import EnergyCheckIn, PlanItem, Project, Tag, Task, TodayPlan
from upoutodo.tests.factories import ProjectFactory, TaskFactory, UserFactory


@pytest.fixture
def admin_user():
    user = UserFactory()
    user.profile.is_admin = True
    user.profile.save(update_fields=["is_admin"])
    return user


@pytest.fixture
def admin_client(admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)
    return client


@pytest.mark.django_db
@pytest.mark.parametrize(
    "url",
    [
        "/api-admin/tasks/",
        "/api-admin/users/",
        "/api-admin/projects/",
        "/api-admin/tags/",
    ],
)
def test_admin_crud_routes_are_not_registered(admin_client, url):
    response = admin_client.get(url, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_django_admin_does_not_register_raw_task_or_planner_models():
    raw_private_models = [Project, Task, Tag, EnergyCheckIn, TodayPlan, PlanItem]

    for model in raw_private_models:
        assert model not in admin.site._registry


@pytest.mark.django_db
def test_openapi_schema_does_not_expose_raw_admin_contracts(admin_client):
    response = admin_client.get("/api/schema/", HTTP_ACCEPT="application/json")

    assert response.status_code == status.HTTP_200_OK
    paths = response.data["paths"]
    components = response.data["components"]["schemas"]

    assert not any(path.startswith("/api-admin/") for path in paths)
    assert "TaskAdmin" not in components
    assert "ProjectAdmin" not in components
    assert "TagAdmin" not in components


@pytest.mark.django_db
def test_admin_dashboard_exposes_aggregate_metrics_without_task_content(admin_client):
    user = UserFactory()
    project = ProjectFactory(created_by=user, updated_by=user)
    TaskFactory(section=project.sections.first(), title="Private task title")

    response = admin_client.get("/api/dashboard", format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["total_tasks"]["total"] == 1
    assert "Private task title" not in str(response.data)
