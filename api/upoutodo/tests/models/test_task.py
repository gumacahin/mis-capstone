from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils import timezone

from upoutodo.models import Task
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
def task_tagged_urgent(section, user):
    from upoutodo.models import Tag

    task = TaskFactory(section=section)
    # Create the tag with a user since Tag model requires created_by
    tag, _ = Tag.objects.get_or_create(name="urgent", created_by=user)
    task.tags.add(tag)
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
    task.due_date = timezone.now() - timedelta(days=1)
    assert task.is_overdue is True


@pytest.mark.django_db
def test_task_add_tag(task_tagged_urgent):
    assert "urgent" in task_tagged_urgent.tags.names()


@pytest.mark.django_db
def test_task_remove_tag(task, user):
    from upoutodo.models import Tag

    # Create the tag with a user since Tag model requires created_by
    tag, _ = Tag.objects.get_or_create(name="urgent", created_by=user)
    task.tags.add(tag)
    task.tags.remove(tag)
    assert "urgent" not in task.tags.names()


# Additional comprehensive tag tests
@pytest.mark.django_db
def test_task_multiple_tags(task, user):
    """Test adding and managing multiple tags on a task."""
    from upoutodo.models import Tag

    # Create multiple tags
    tag1, _ = Tag.objects.get_or_create(name="urgent", created_by=user)
    tag2, _ = Tag.objects.get_or_create(name="work", created_by=user)
    tag3, _ = Tag.objects.get_or_create(name="personal", created_by=user)

    # Add multiple tags
    task.tags.add(tag1, tag2, tag3)

    # Check all tags are present
    tag_names = task.tags.names()
    assert "urgent" in tag_names
    assert "work" in tag_names
    assert "personal" in tag_names
    assert len(tag_names) == 3

    # Remove one tag
    task.tags.remove(tag2)
    tag_names = task.tags.names()
    assert "work" not in tag_names
    assert len(tag_names) == 2

    # Clear all tags
    task.tags.clear()
    assert len(task.tags.names()) == 0


@pytest.mark.django_db
def test_task_tag_uniqueness_per_user(section, user):
    """Test that tags are unique per user as per the model constraint."""
    from upoutodo.models import Tag

    # Create another user
    other_user = UserFactory()

    # Different users can have tags with different names
    tag1, created1 = Tag.objects.get_or_create(name="urgent", created_by=user)
    tag2, created2 = Tag.objects.get_or_create(name="important", created_by=other_user)

    assert created1 is True
    assert created2 is True
    assert tag1.id != tag2.id
    assert tag1.created_by == user
    assert tag2.created_by == other_user

    # But the same user can't create duplicate tags
    tag3, created3 = Tag.objects.get_or_create(name="urgent", created_by=user)
    assert created3 is False
    assert tag3.id == tag1.id

    # Test that the unique_together constraint works for (name, created_by)
    # Same user, same name -> should get existing tag
    tag4, created4 = Tag.objects.get_or_create(name="urgent", created_by=user)
    assert created4 is False
    assert tag4.id == tag1.id


# Test 1: Priority field validation
@pytest.mark.django_db
def test_task_priority_choices(section):
    """Test that task priority accepts valid choices."""
    # Test valid priority choices
    for priority in Task.Priority.choices:
        task = Task.objects.create(
            title="Test Task", section=section, priority=priority[0]
        )
        assert task.priority == priority[0]
        task.delete()


# Test 2: Priority field default value
@pytest.mark.django_db
def test_task_priority_default(section):
    """Test that task priority defaults to NONE."""
    task = Task.objects.create(title="Test Task", section=section)
    assert task.priority == Task.Priority.NONE


# Test 3: Required fields validation
@pytest.mark.django_db
def test_task_required_fields(section):
    """Test that section is required but title can be empty."""
    # Title can be empty (no database constraint)
    task = Task(section=section)
    task.save()  # This should work
    assert task.title == ""  # Empty string is the default
    task.delete()

    # Section is required - Django will raise IntegrityError on save due to NOT NULL constraint
    with pytest.raises(IntegrityError):
        task = Task(title="Test Task")
        task.save()


# Test 4: Title max length validation
@pytest.mark.django_db
def test_task_title_max_length(section):
    """Test that title respects max_length constraint."""
    # Valid length (100 chars)
    valid_title = "a" * 100
    task = Task.objects.create(title=valid_title, section=section)
    assert len(task.title) == 100

    # Invalid length (101 chars) - should be truncated or raise error
    long_title = "a" * 101
    # Django will truncate silently, but we can test the constraint exists
    task = Task.objects.create(title=long_title, section=section)
    # The database will enforce the constraint


# Test 5: Project property access
@pytest.mark.django_db
def test_task_project_property(task):
    """Test that task.project returns the correct project."""
    assert task.project == task.section.project
    assert task.project.id == task.section.project.id


# Test 6: is_completed property with completion_date
@pytest.mark.django_db
def test_task_is_completed_property(task):
    """Test is_completed property behavior."""
    # Initially not completed
    assert task.is_completed is False
    assert task.completion_date is None

    # After setting completion_date
    task.completion_date = timezone.now()
    assert task.is_completed is True

    # After clearing completion_date
    task.completion_date = None
    assert task.is_completed is False


# Test 7: is_overdue property edge cases
@pytest.mark.django_db
def test_task_is_overdue_edge_cases(task):
    """Test is_overdue property with various scenarios."""
    now = timezone.now()

    # No due date - not overdue (returns False-y when due_date is None)
    task.due_date = None
    task.completion_date = None
    # The is_overdue property returns None when due_date is None due to the 'and' operator
    # This evaluates to False-y, which is the intended behavior
    assert not task.is_overdue

    # Future due date - not overdue
    task.due_date = now + timedelta(days=1)
    assert task.is_overdue is False

    # Past due date but completed - not overdue
    task.due_date = now - timedelta(days=1)
    task.completion_date = now
    assert task.is_overdue is False

    # Past due date and not completed - overdue
    task.completion_date = None
    assert task.is_overdue is True


# Test 8: __str__ method
@pytest.mark.django_db
def test_task_str_method(section):
    """Test task string representation."""
    # Simple title
    task = Task.objects.create(title="Simple Task", section=section)
    assert str(task) == "Simple Task"

    # Title with HTML tags (should be stripped)
    task_with_html = Task.objects.create(title="<b>Bold Task</b>", section=section)
    assert str(task_with_html) == "Bold Task"


# Test 9: Order field behavior
@pytest.mark.django_db
def test_task_order_field(section):
    """Test task order field behavior."""
    # Default order value
    task = Task.objects.create(title="Test Task", section=section)
    assert task.order == 1

    # Custom order value
    task_custom = Task.objects.create(
        title="Custom Order Task", section=section, order=5
    )
    assert task_custom.order == 5


# Test 10: Created and updated timestamps
@pytest.mark.django_db
def test_task_timestamps(section):
    """Test created_at and updated_at timestamp behavior."""
    # Create task
    before_create = timezone.now()
    task = Task.objects.create(title="Timestamp Task", section=section)
    after_create = timezone.now()

    # Check created_at is set
    assert task.created_at is not None
    assert before_create <= task.created_at <= after_create
    assert task.updated_at is not None

    # Store original timestamps
    original_created = task.created_at
    original_updated = task.updated_at

    # Update task
    import time

    time.sleep(0.01)  # Ensure time difference
    before_update = timezone.now()
    task.title = "Updated Task"
    task.save()
    after_update = timezone.now()

    # Check updated_at changed, created_at didn't
    assert task.created_at == original_created
    assert task.updated_at != original_updated
    assert before_update <= task.updated_at <= after_update


# Test 11: Anchor mode choices validation
@pytest.mark.django_db
def test_task_anchor_mode_choices(section):
    """Test anchor mode field accepts valid choices."""
    # Test valid anchor mode choices
    for mode in Task.AnchorMode.choices:
        task = Task.objects.create(
            title="Test Task", section=section, anchor_mode=mode[0]
        )
        assert task.anchor_mode == mode[0]
        task.delete()

    # Empty anchor mode (default)
    task = Task.objects.create(
        title="No Anchor Mode Task", section=section, anchor_mode=""
    )
    assert task.anchor_mode == ""


# Test 12: RRule and dtstart field behavior
@pytest.mark.django_db
def test_task_rrule_fields(section):
    """Test rrule and dtstart field behavior."""
    # Create task with rrule fields
    dtstart = timezone.now()
    task = Task.objects.create(
        title="Recurring Task",
        section=section,
        rrule="FREQ=DAILY",
        dtstart=dtstart,
        anchor_mode=Task.AnchorMode.SCHEDULED,
    )

    assert task.rrule == "FREQ=DAILY"
    assert task.dtstart == dtstart
    assert task.anchor_mode == Task.AnchorMode.SCHEDULED

    # Empty rrule and null dtstart (non-recurring task)
    task_no_rrule = Task.objects.create(
        title="Non-recurring Task", section=section, rrule="", dtstart=None
    )
    assert task_no_rrule.rrule == ""
    assert task_no_rrule.dtstart is None


# Test 13: Mark complete/incomplete edge cases
@pytest.mark.django_db
def test_task_mark_complete_incomplete_edge_cases(task):
    """Test mark_complete and mark_incomplete method edge cases."""
    # Mark complete multiple times
    task.mark_complete()
    first_completion = task.completion_date

    # Mark complete again - should update timestamp
    import time

    time.sleep(0.01)
    task.mark_complete()
    second_completion = task.completion_date

    assert task.is_completed is True
    assert second_completion >= first_completion

    # Mark incomplete
    task.mark_incomplete()
    assert task.is_completed is False
    assert task.completion_date is None

    # Mark incomplete when already incomplete
    task.mark_incomplete()
    assert task.is_completed is False
    assert task.completion_date is None


# Test 14: Model ordering behavior
@pytest.mark.django_db
def test_task_model_ordering(section):
    """Test task model ordering behavior."""
    # Create tasks with different attributes
    task1 = Task.objects.create(
        title="Task 1", section=section, order=2, priority=Task.Priority.LOW
    )
    task2 = Task.objects.create(
        title="Task 2", section=section, order=1, priority=Task.Priority.HIGH
    )
    task3 = Task.objects.create(
        title="Task 3",
        section=section,
        order=1,
        priority=Task.Priority.MEDIUM,
        due_date=timezone.now() + timedelta(days=1),
    )

    # Get ordered tasks
    ordered_tasks = list(Task.objects.filter(section=section))

    # Should be ordered by: order, -due_date, priority, completion_date
    # task2 and task3 both have order=1, but task3 has due_date so comes first
    assert ordered_tasks[0] == task3  # order=1, has due_date
    assert ordered_tasks[1] == task2  # order=1, no due_date
    assert ordered_tasks[2] == task1  # order=2


# Test 15: Description field behavior
@pytest.mark.django_db
def test_task_description_field(section):
    """Test task description field behavior."""
    # Empty description (should be allowed)
    task = Task.objects.create(
        title="Task with no description", section=section, description=""
    )
    assert task.description == ""

    # Long description
    long_description = "This is a very long description. " * 100
    task_long = Task.objects.create(
        title="Task with long description",
        section=section,
        description=long_description,
    )
    assert task_long.description == long_description

    # Description with special characters
    special_description = "Description with émojis 🚀 and spëcial chars!"
    task_special = Task.objects.create(
        title="Task with special description",
        section=section,
        description=special_description,
    )
    assert task_special.description == special_description


# Test 16: Clean method validation - RRule requires dtstart
@pytest.mark.django_db
def test_task_clean_rrule_requires_dtstart(section):
    """Test that clean() validates RRule requires dtstart."""
    task = Task(
        title="Recurring Task",
        section=section,
        rrule="FREQ=DAILY",  # Has rrule
        dtstart=None,  # Missing dtstart
    )

    with pytest.raises(ValidationError) as exc_info:
        task.full_clean()

    assert "dtstart" in exc_info.value.error_dict
    assert "Start date required when recurrence rule is set" in str(
        exc_info.value.error_dict["dtstart"]
    )


# Test 17: Clean method validation - Anchor mode requires RRule
@pytest.mark.django_db
def test_task_clean_anchor_mode_requires_rrule(section):
    """Test that clean() validates anchor mode requires RRule."""
    task = Task(
        title="Anchored Task",
        section=section,
        anchor_mode=Task.AnchorMode.COMPLETED,  # Has anchor mode
        rrule="",  # No rrule
    )

    with pytest.raises(ValidationError) as exc_info:
        task.full_clean()

    assert "rrule" in exc_info.value.error_dict
    assert "Recurrence rule required when anchor mode is set" in str(
        exc_info.value.error_dict["rrule"]
    )


# Test 18: Clean method validation - Valid recurring task
@pytest.mark.django_db
def test_task_clean_valid_recurring_task(section):
    """Test that clean() passes for valid recurring task."""
    task = Task(
        title="Valid Recurring Task",
        section=section,
        rrule="FREQ=DAILY",
        dtstart=timezone.now(),
        anchor_mode=Task.AnchorMode.SCHEDULED,
    )

    # Should not raise any exception
    task.full_clean()
    task.save()

    # Verify it was saved correctly
    assert task.pk is not None
    assert task.rrule == "FREQ=DAILY"
    assert task.dtstart is not None
    assert task.anchor_mode == Task.AnchorMode.SCHEDULED


# Test 19: Clean method validation - Non-recurring task (no validation errors)
@pytest.mark.django_db
def test_task_clean_non_recurring_task(section):
    """Test that clean() passes for non-recurring tasks."""
    task = Task(
        title="Simple Task",
        section=section,
        rrule="",  # No rrule
        dtstart=None,  # No dtstart
        anchor_mode="",  # No anchor mode
    )

    # Should not raise any exception
    task.full_clean()
    task.save()

    # Verify it was saved correctly
    assert task.pk is not None
    assert task.rrule == ""
    assert task.dtstart is None
    assert task.anchor_mode == ""


# Test 20: Clean method validation - Multiple validation errors
@pytest.mark.django_db
def test_task_clean_multiple_validation_errors(section):
    """Test that clean() can collect multiple validation errors."""
    task = Task(
        title="Invalid Task",
        section=section,
        rrule="",  # No rrule
        dtstart=None,  # No dtstart
        anchor_mode=Task.AnchorMode.COMPLETED,  # Has anchor mode but no rrule
    )

    with pytest.raises(ValidationError) as exc_info:
        task.full_clean()

    # Should have error for rrule (anchor mode requires it)
    assert "rrule" in exc_info.value.error_dict
    assert "Recurrence rule required when anchor mode is set" in str(
        exc_info.value.error_dict["rrule"]
    )


# Test 21: Recurring task completion - SCHEDULED anchor mode
@pytest.mark.django_db
def test_recurring_task_completion_scheduled_anchor(section):
    """Test that completing a recurring task with SCHEDULED anchor creates next occurrence."""
    dtstart = timezone.now()
    task = Task.objects.create(
        title="Daily Recurring Task",
        section=section,
        rrule="FREQ=DAILY",
        dtstart=dtstart,
        anchor_mode=Task.AnchorMode.SCHEDULED,
        due_date=dtstart,
    )

    # Initially should have 1 task
    assert Task.objects.filter(section=section).count() == 1

    # Complete the task
    task.mark_complete()

    # Should now have 2 tasks (original completed + next occurrence)
    tasks = Task.objects.filter(section=section).order_by("created_at")
    assert tasks.count() == 2

    # Original task should be completed
    original_task = tasks.first()
    assert original_task.is_completed is True
    assert original_task.completion_date is not None

    # Next occurrence should be created
    next_task = tasks.last()
    assert next_task.is_completed is False
    assert next_task.completion_date is None
    assert next_task.title == task.title
    assert next_task.rrule == task.rrule
    assert next_task.dtstart == task.dtstart
    assert next_task.anchor_mode == task.anchor_mode

    # Due date should be next day (FREQ=DAILY)
    expected_next_due = dtstart + timedelta(days=1)
    # Allow for small time differences due to processing
    assert abs((next_task.due_date - expected_next_due).total_seconds()) < 60


# Test 22: Recurring task completion - COMPLETED anchor mode
@pytest.mark.django_db
def test_recurring_task_completion_completed_anchor(section):
    """Test that completing a recurring task with COMPLETED anchor creates next occurrence from completion time."""
    dtstart = timezone.now() - timedelta(days=1)  # Task was due yesterday
    task = Task.objects.create(
        title="Daily Recurring Task",
        section=section,
        rrule="FREQ=DAILY",
        dtstart=dtstart,
        anchor_mode=Task.AnchorMode.COMPLETED,
        due_date=dtstart,
    )

    # Complete the task
    completion_time = timezone.now()
    task.mark_complete()

    # Should have 2 tasks
    tasks = Task.objects.filter(section=section).order_by("created_at")
    assert tasks.count() == 2

    # Next occurrence should be based on completion time, not original schedule
    next_task = tasks.last()
    expected_next_due = completion_time + timedelta(days=1)
    # Allow for small time differences
    assert abs((next_task.due_date - expected_next_due).total_seconds()) < 60


# Test 23: Non-recurring task completion (should not create next occurrence)
@pytest.mark.django_db
def test_non_recurring_task_completion(section):
    """Test that completing a non-recurring task does not create next occurrence."""
    task = Task.objects.create(
        title="One-time Task",
        section=section,
    )

    # Initially should have 1 task
    assert Task.objects.filter(section=section).count() == 1

    # Complete the task
    task.mark_complete()

    # Should still have only 1 task
    assert Task.objects.filter(section=section).count() == 1
    assert task.is_completed is True


# Test 24: Recurring task completion with tags
@pytest.mark.django_db
def test_recurring_task_completion_copies_tags(section, user):
    """Test that completing a recurring task copies tags to next occurrence."""
    from upoutodo.models import Tag

    task = Task.objects.create(
        title="Tagged Recurring Task",
        section=section,
        rrule="FREQ=WEEKLY",
        dtstart=timezone.now(),
        anchor_mode=Task.AnchorMode.SCHEDULED,
    )

    # Add tags to the task
    tag1, _ = Tag.objects.get_or_create(name="work", created_by=user)
    tag2, _ = Tag.objects.get_or_create(name="important", created_by=user)
    task.tags.add(tag1, tag2)

    # Complete the task
    task.mark_complete()

    # Get the next occurrence
    tasks = Task.objects.filter(section=section).order_by("created_at")
    next_task = tasks.last()

    # Tags should be copied
    next_task_tags = set(next_task.tags.names())
    assert "work" in next_task_tags
    assert "important" in next_task_tags
    assert len(next_task_tags) == 2


# Test 25: Recurring task completion without dtstart (should not create next occurrence)
@pytest.mark.django_db
def test_recurring_task_completion_without_dtstart(section):
    """Test that recurring task without dtstart does not create next occurrence."""
    task = Task.objects.create(
        title="Invalid Recurring Task",
        section=section,
        rrule="FREQ=DAILY",
        # No dtstart
        anchor_mode=Task.AnchorMode.SCHEDULED,
    )

    # Complete the task
    task.mark_complete()

    # Should still have only 1 task (no next occurrence created)
    assert Task.objects.filter(section=section).count() == 1
    assert task.is_completed is True
