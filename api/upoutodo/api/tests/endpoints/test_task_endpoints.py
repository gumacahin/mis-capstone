import pytest
from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.api.tests.factories import ProjectFactory, TaskFactory, UserFactory

fake = Faker()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def projects(user):
    return [ProjectFactory(created_by=user, updated_by=user) for _ in range(10)]


@pytest.fixture
def section(projects):
    return projects[0].sections.first()


@pytest.fixture
def task(section):
    return TaskFactory(section=section)


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.mark.django_db
def test_task_list(auth_client):
    url = reverse("task-list")
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 0


@pytest.mark.django_db
def test_task_list_only_own(auth_client):
    url = reverse("task-list")
    other_user = UserFactory()
    other_project = ProjectFactory(created_by=other_user, updated_by=other_user)
    other_section = other_project.sections.first()
    TaskFactory(section=other_section)
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 0


@pytest.mark.django_db
def test_task_retrieve(auth_client, task):
    # task = TaskFactory()
    print(f"{task.id=}")
    url = reverse("task-detail", args=[task.id])
    print(f"{url=}")
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["title"] == task.title


@pytest.mark.django_db
def test_task_create_title_only_task(auth_client):
    url = reverse("task-list")
    data = {"title": fake.sentence()}
    response = auth_client.post(url, data=data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["title"] == data["title"]


@pytest.mark.django_db
def test_task_update(auth_client, task):
    updated_title = fake.sentence()
    url = reverse("task-detail", args=[task.id])
    data = {"title": updated_title}
    response = auth_client.put(url, data=data, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["title"] == updated_title


@pytest.mark.django_db
def test_task_destroy(auth_client, task):
    url = reverse("task-detail", args=[task.id])
    response = auth_client.delete(url, format="json")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.data is None

    with pytest.raises(task.DoesNotExist):
        task.refresh_from_db()
