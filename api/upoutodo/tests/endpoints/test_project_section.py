import pytest
from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.models import ProjectSection
from upoutodo.tests.factories import (
    ProjectFactory,
    ProjectSectionFactory,
    TaskFactory,
    UserFactory,
)

fake = Faker()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def project_without_sections(user):
    return ProjectFactory(created_by=user, updated_by=user)


@pytest.fixture
def project_with_three_sections(user):
    project = ProjectFactory(created_by=user, updated_by=user)
    sections = [ProjectSectionFactory(project=project) for _ in range(1)]
    ProjectSectionFactory(project=project)
    return project, sections


@pytest.fixture
def project_with_section(user):
    project = ProjectFactory(created_by=user, updated_by=user)
    section = ProjectSectionFactory(project=project)
    return project, section


@pytest.fixture
def inbox_with_task_in_default_section(user):
    inbox = user.profile.inbox
    section = inbox.sections.first()
    tasks = [TaskFactory(section=section) for _ in range(3)]
    return inbox, tasks


@pytest.fixture
def task(section):
    return TaskFactory(section=section)


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.mark.django_db
def test_project_section_list(auth_client, project_with_three_sections):
    _, sections = project_with_three_sections
    url = reverse("projectsection-list")
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    # FIXME: count is off by one
    # assert response.data["count"] == len(sections)


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
def test_project_section_create(auth_client, user, project_without_sections):
    url = reverse("projectsection-list")
    title = " ".join(fake.words(3))
    data = {
        "title": title,
        "project": project_without_sections.id,
        "preceding_section": 1,
    }
    response = auth_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["title"] == title
    id = response.data["id"]
    section = ProjectSection.objects.get(id=id)
    assert section in project_without_sections.sections.all()


# @pytest.mark.skip(reason="FIXME: Not working")
@pytest.mark.django_db
def test_project_section_update(auth_client, project_with_section):
    project, section = project_with_section
    updated_title = " ".join(fake.words(3))
    data = {"title": updated_title, "project": project.id, "preceding_section": 1}
    url = reverse("projectsection-detail", args=[section.id])
    response = auth_client.put(url, data, format="json")
    print(response.data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["title"] == updated_title


@pytest.mark.django_db
def test_project_section_destroy(auth_client, project_with_section):
    project, section = project_with_section
    url = reverse("projectsection-detail", args=[section.id])
    response = auth_client.delete(url, format="json")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    with pytest.raises(section.DoesNotExist):
        section.refresh_from_db()
    assert len(project.sections.filter(is_default=False)) == 0


@pytest.mark.django_db
def test_project_destroy_disallow_inbox_deletion(auth_client, user):
    project = user.profile.inbox
    url = reverse("project-detail", args=[project.id])
    response = auth_client.delete(url, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_project_update_disallow_inbox_update(auth_client, user):
    project = user.profile.inbox
    url = reverse("project-detail", args=[project.id])
    response = auth_client.put(url, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
