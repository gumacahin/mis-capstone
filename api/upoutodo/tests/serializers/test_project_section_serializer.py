import pytest

from upoutodo.serializers import ProjectSectionSerializer
from upoutodo.tests.factories import ProjectFactory, UserFactory


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def project(user):
    return ProjectFactory(created_by=user, updated_by=user)


@pytest.fixture
def section(project):
    return project.sections.first()


@pytest.mark.django_db
def test_project_serializer_valid_data(project):
    valid_data = {
        "title": "Test Section",
        "project": project.id,
    }
    serializer = ProjectSectionSerializer(data=valid_data)
    assert serializer.is_valid()
