import pytest
from rest_framework import status
from rest_framework.test import APIClient

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
def test_admin_crud_viewsets_do_not_expose_raw_global_data(admin_client, url):
    response = admin_client.get(url, format="json")

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
def test_admin_dashboard_exposes_aggregate_metrics_without_task_content(admin_client):
    user = UserFactory()
    project = ProjectFactory(created_by=user, updated_by=user)
    TaskFactory(section=project.sections.first(), title="Private task title")

    response = admin_client.get("/api/dashboard", format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["total_tasks"]["total"] == 1
    assert "Private task title" not in str(response.data)
