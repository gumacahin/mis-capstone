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
def test_only_title_is_required():
    title_only = {"title": fake.sentence()}
    serializer = TaskSerializer(data=title_only)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_due_date_can_not_be_in_the_past(task_data):
    task_data["due_date"] = fake.date_between(start_date="-1y", end_date="now")
    serializer = TaskSerializer(data=task_data)
    assert not serializer.is_valid()
    assert serializer.errors["due_date"][0] == "Date cannot be in the past"
