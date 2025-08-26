"""
Tests for Task model recurrence functionality.
"""

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone

from upoutodo.models import Project, ProjectSection, Task
from upoutodo.recurrence import parse_recurrence


@pytest.fixture
def user():
    """Create a test user."""
    return get_user_model().objects.create_user(
        username="testuser", email="test@example.com", password="testpass123"
    )


@pytest.fixture
def project(user):
    """Create a test project."""
    return Project.objects.create(
        title="Test Project", created_by=user, updated_by=user
    )


@pytest.fixture
def section(project):
    """Create a test section."""
    return ProjectSection.objects.create(title="Test Section", project=project, order=1)


@pytest.mark.django_db
def test_create_recurring_task(section):
    """Test creating a task with recurrence."""
    # Parse recurrence first to get rrule and anchor
    from upoutodo.recurrence import parse_recurrence

    rrule, anchor = parse_recurrence("every monday at 9am")

    task = Task.objects.create(
        title="Weekly Review",
        section=section,
        recurrence="every monday at 9am",
        rrule=rrule,
        recurrence_anchor=anchor,
        is_recurring=True,
    )

    assert task.is_recurring
    assert task.recurrence == "every monday at 9am"
    assert task.rrule is not None
    assert task.recurrence_anchor is not None
    assert task.recurrence_timezone == "Asia/Manila"
    assert task.repeat_when_complete


@pytest.mark.django_db
def test_mark_complete_advances_recurring_task(section):
    """Test that completing a recurring task advances it to the next occurrence."""
    # Parse recurrence first to get rrule and anchor
    from upoutodo.recurrence import parse_recurrence

    rrule, anchor = parse_recurrence("every weekday at 9am")

    # Create a recurring task
    task = Task.objects.create(
        title="Daily Standup",
        section=section,
        recurrence="every weekday at 9am",
        rrule=rrule,
        recurrence_anchor=anchor,
        is_recurring=True,
        due_date=timezone.now(),
    )

    # Store the original due date
    original_due_date = task.due_date

    # Mark the task as complete
    task.mark_complete()

    # The task should now have a new due date
    assert task.due_date is not None
    assert task.due_date != original_due_date
    assert task.completion_date is None  # Should be cleared for next instance


@pytest.mark.django_db
def test_non_recurring_task_completion(section):
    """Test that non-recurring tasks don't advance."""
    task = Task.objects.create(
        title="One-time Task",
        section=section,
        is_recurring=False,
        due_date=timezone.now(),
    )

    original_due_date = task.due_date

    # Mark the task as complete
    task.mark_complete()

    # The task should keep the same due date
    assert task.due_date == original_due_date
    assert task.completion_date is not None


@pytest.mark.django_db
def test_recurring_task_properties(section):
    """Test recurring task computed properties."""
    # Parse recurrence first to get rrule and anchor
    from upoutodo.recurrence import parse_recurrence

    rrule, anchor = parse_recurrence("every 3rd friday")

    task = Task.objects.create(
        title="Monthly Review",
        section=section,
        recurrence="every 3rd friday",
        rrule=rrule,
        recurrence_anchor=anchor,
        is_recurring=True,
    )

    # Test that we can get the next occurrence
    assert task.next_occurrence is not None

    # Test humanized recurrence
    assert task.humanized_recurrence is not None
    assert "3rd Friday" in task.humanized_recurrence


@pytest.mark.django_db
def test_recurrence_parsing_in_serializer(section):
    """Test that recurrence is properly parsed when creating a task."""
    # This test simulates what happens in the serializer
    recurrence = "every tuesday at 5pm"
    rrule, anchor = parse_recurrence(recurrence)

    task = Task.objects.create(
        title="Weekly Meeting",
        section=section,
        recurrence=recurrence,
        rrule=rrule,
        recurrence_anchor=anchor,
        is_recurring=True,
    )

    assert task.rrule == "FREQ=WEEKLY;BYDAY=TU;BYHOUR=17;BYMINUTE=0;BYSECOND=0"
    assert task.recurrence_anchor is not None
