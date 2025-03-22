import pytest
from django.contrib.auth import get_user_model
from django.forms.models import model_to_dict
from faker import Faker

from upoutodo.api.serializers import ProjectSerializer
from upoutodo.api.tests.factories import ProjectFactory, UserFactory

User = get_user_model()
fake = Faker()


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def project(user):
    return ProjectFactory(created_by=user, updated_by=user)


@pytest.mark.django_db
def test_project_serializer_valid_data(project):
    data = model_to_dict(project)
    serializer = ProjectSerializer(data=data)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_project_serializer_invalid_data():
    invalid_data = {
        "title": "",  # Title is required
    }
    serializer = ProjectSerializer(data=invalid_data)
    assert not serializer.is_valid()
    assert "title" in serializer.errors
