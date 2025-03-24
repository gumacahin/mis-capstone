import pytest
from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.models import Project
from upoutodo.tests.factories import ProjectFactory, TaskFactory, UserFactory

fake = Faker()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def project(user):
    return ProjectFactory(created_by=user, updated_by=user)


@pytest.fixture
def ten_projects(user):
    return [ProjectFactory(created_by=user, updated_by=user) for _ in range(10)]


@pytest.fixture
def section(project):
    return project.sections.first()


@pytest.fixture
def task(section):
    return TaskFactory(section=section)


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def inbox_with_task_in_default_section(user):
    inbox = user.profile.inbox
    section = inbox.sections.first()
    task = TaskFactory(section=section)
    return inbox, task


@pytest.mark.django_db
def test_user_inbox(
    auth_client,
):
    url = reverse("project-inbox")
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_inbox_with_task_in_default_section(
    auth_client, inbox_with_task_in_default_section
):
    inbox, task = inbox_with_task_in_default_section
    url = reverse("project-inbox")
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == inbox.id
    print(f"{response.data=}")
    assert any(t["id"] == task.id for t in response.data["sections"][0]["tasks"])


@pytest.mark.django_db
def test_project_list(auth_client):
    url = reverse("project-list")
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data
    assert response.data["count"] == 0


@pytest.mark.django_db
def test_project_list_only_own(auth_client, ten_projects):
    url = reverse("project-list")
    other_user = UserFactory()
    ProjectFactory(created_by=other_user, updated_by=other_user)
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data
    assert response.data["count"] == len(ten_projects)


@pytest.mark.django_db
def test_project_create(auth_client, user):
    url = reverse("project-list")
    data = {"title": fake.sentence()}
    response = auth_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["title"] == data["title"]
    project = Project.objects.get(id=response.data["id"])
    assert project.created_by == user
    assert project.updated_by == user


@pytest.mark.django_db
def test_project_retrieve(auth_client, project):
    url = reverse("project-detail", args=[project.id])
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == project.id


@pytest.mark.django_db
def test_project_update(auth_client, project, user):
    updated_title = fake.sentence()
    data = {"title": updated_title}
    url = reverse("project-detail", args=[project.id])
    response = auth_client.put(url, data, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["title"] == updated_title
    project = Project.objects.get(id=response.data["id"])
    assert project.updated_by == user


@pytest.mark.django_db
def test_project_destroy(auth_client, project):
    url = reverse("project-detail", args=[project.id])
    response = auth_client.delete(url, format="json")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    with pytest.raises(project.DoesNotExist):
        project.refresh_from_db()


@pytest.mark.django_db
def test_project_destroy_disallow_inbox_deletion(auth_client, user):
    project = user.profile.inbox
    url = reverse("project-detail", args=[project.id])
    response = auth_client.delete(url, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data[0] == "The default project cannot be deleted."


@pytest.mark.django_db
def test_project_update_disallow_inbox_update(auth_client, user):
    project = user.profile.inbox
    url = reverse("project-detail", args=[project.id])
    response = auth_client.patch(url, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data[0] == "Only 'view' can be updated in the default project."
