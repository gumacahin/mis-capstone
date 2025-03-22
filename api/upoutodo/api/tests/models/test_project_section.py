import pytest
from django.contrib.auth import get_user_model

from upoutodo.api.models import Project, ProjectSection

User = get_user_model()


@pytest.fixture
def user():
    return User.objects.create_user(username="testuser", password="12345")


@pytest.fixture
def project(user):
    return Project.objects.create(
        title="Test Project", created_by=user, updated_by=user
    )


@pytest.mark.django_db
def test_create_project_section(project, user):
    project_section = project.sections.create(title="Test Section")
    assert project_section.title == "Test Section"
    assert project_section.order == 0


@pytest.mark.django_db
def test_delete_project_section(project):
    project_section = project.sections.create(title="Test Section")
    project_section_id = project_section.id
    project_section.delete()
    with pytest.raises(ProjectSection.DoesNotExist):
        ProjectSection.objects.get(id=project_section_id)
