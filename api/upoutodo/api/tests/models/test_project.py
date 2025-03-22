import pytest
from django.contrib.auth.models import User

from upoutodo.api.models import Project


@pytest.mark.django_db
def test_project_creation():
    user = User.objects.create_user(username="testuser", password="12345")
    project = Project.objects.create(
        title="Test Project",
        created_by=user,
        updated_by=user,
    )

    assert project.title == "Test Project"
    assert project.view == "list"
    assert project.default_section.title == Project.DEFAULT_PROJECT_SECTION_TITLE
    assert project.created_by == user
    assert project in Project.objects.all()
