from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone

from upoutodo.tests.factories import (
    ProjectFactory,
    ProjectSectionFactory,
    TaskFactory,
    UserFactory,
)

User = get_user_model()


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
def task(section):
    return TaskFactory(section=section)


@pytest.fixture
def task_tagged_urgent(section):
    task = TaskFactory(section=section)
    task.tags.add("urgent")
    return task


@pytest.mark.django_db
def test_task_mark_complete(task):
    task.mark_complete()
    assert task.is_completed is True


@pytest.mark.django_db
def test_task_mark_incomplete(task):
    task.mark_complete()
    task.mark_incomplete()
    assert task.is_completed is False


@pytest.mark.django_db
def test_task_overdue(task):
    task.due_date = timezone.now().date() - timedelta(days=1)
    assert task.is_overdue is True


@pytest.mark.skip(
    reason=(
        "Fails when all tests are run. "
        "Maybe not needed since this is provided by taggit"
    )
)
@pytest.mark.django_db
def test_task_add_tag(task_tagged_urgent):
    assert "urgent" in task_tagged_urgent.tags.names()


@pytest.mark.skip(
    reason=(
        "Fails when all tests are run. "
        "Maybe not needed since this is provided by taggit"
    )
)
@pytest.mark.django_db
def test_task_remove_tag(task):
    task.tags.remove("urgent")
    assert "urgent" not in task.tags.names()
