import pytest
from django.contrib.auth import get_user_model

from upoutodo.models import Project, UserProfile

User = get_user_model()


@pytest.mark.django_db
def test_create_user_profile():
    # Create a new user
    user = User.objects.create_user(username="testuser", password="testpassword")

    profile = UserProfile.objects.get(user=user)
    assert profile is not None, "User profile should be created for the new user"


@pytest.mark.django_db
def test_create_default_project():
    # Create a new user
    user = User.objects.create_user(username="testuser", password="testpassword")

    default_project = Project.objects.get(created_by=user, is_default=True)
    assert (
        default_project is not None
    ), "Default project should be created for the new user"
    assert (
        default_project.title == Project.DEFAULT_PROJECT_TITLE
    ), f"Default project name should be the {Project.DEFAULT_PROJECT_TITLE}"
