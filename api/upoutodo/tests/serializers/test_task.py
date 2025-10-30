import pytest
from faker import Faker

from upoutodo.models import Task
from upoutodo.serializers import TaskSerializer
from upoutodo.tests.factories import ProjectFactory, ProjectSectionFactory, UserFactory

fake = Faker()


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def project(user):
    return ProjectFactory(created_by=user, updated_by=user)


@pytest.fixture
def section(project):
    return ProjectSectionFactory(project=project)


@pytest.fixture
def task_data(section):
    return {
        "title": fake.sentence(),
        "description": fake.text(),
        "due_date": fake.date(),
        "priority": Task.Priority.HIGH,
        "completion_date": fake.date(),
        "section": section.id,
    }


@pytest.mark.django_db
def test_title_and_section_are_required(section):
    data = {"title": fake.sentence(), "section": section.id}
    serializer = TaskSerializer(data=data)
    assert serializer.is_valid()


# Note: due_date is read_only and calculated from rrule/dtstart, so direct validation is not applicable
