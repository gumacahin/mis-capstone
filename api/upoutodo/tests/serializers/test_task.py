from datetime import datetime, timezone
from unittest.mock import Mock, patch

import pytest
from django.contrib.contenttypes.models import ContentType
from django_comments.models import Comment
from faker import Faker

from upoutodo.models import Project, Task
from upoutodo.models.tag import Tag
from upoutodo.serializers import TaskSerializer
from upoutodo.tests.factories import (
    ProjectFactory,
    ProjectSectionFactory,
    TaskFactory,
    UserFactory,
)

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
def task(section):
    return TaskFactory(section=section)


@pytest.fixture
def task_data(section):
    return {
        "title": fake.sentence(),
        "description": fake.text(),
        "priority": Task.Priority.HIGH,
        "section": section.id,
    }


@pytest.fixture
def recurring_task_data(section):
    return {
        "title": fake.sentence(),
        "description": fake.text(),
        "priority": Task.Priority.MEDIUM,
        "section": section.id,
        "rrule": "FREQ=DAILY",
        "dtstart": datetime.now(timezone.utc),
        "anchor_mode": Task.AnchorMode.SCHEDULED,
    }


@pytest.fixture
def mock_request(user):
    """Mock request object with authenticated user."""
    request = Mock()
    request.user = user
    return request


class TestTaskSerializerValidation:
    """Test TaskSerializer field validation."""

    @pytest.mark.django_db
    def test_title_and_section_are_required(self, section):
        """Test that title and section are required fields."""
        data = {"title": fake.sentence(), "section": section.id}
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()

    @pytest.mark.django_db
    def test_missing_title_fails_validation(self, section):
        """Test that missing title fails validation."""
        data = {"section": section.id}
        serializer = TaskSerializer(data=data)
        assert not serializer.is_valid()
        assert "title" in serializer.errors

    @pytest.mark.django_db
    def test_missing_section_fails_validation(self):
        """Test that missing section fails validation."""
        data = {"title": fake.sentence()}
        serializer = TaskSerializer(data=data)
        assert not serializer.is_valid()
        assert "section" in serializer.errors

    @pytest.mark.django_db
    def test_invalid_section_fails_validation(self):
        """Test that invalid section ID fails validation."""
        data = {"title": fake.sentence(), "section": 99999}
        serializer = TaskSerializer(data=data)
        assert not serializer.is_valid()
        assert "section" in serializer.errors

    @pytest.mark.django_db
    def test_valid_priority_values(self, section):
        """Test that valid priority values are accepted."""
        for priority in Task.Priority.values:
            data = {
                "title": fake.sentence(),
                "section": section.id,
                "priority": priority,
            }
            serializer = TaskSerializer(data=data)
            assert serializer.is_valid(), f"Priority {priority} should be valid"

    @pytest.mark.django_db
    def test_invalid_priority_fails_validation(self, section):
        """Test that invalid priority value fails validation."""
        data = {"title": fake.sentence(), "section": section.id, "priority": "INVALID"}
        serializer = TaskSerializer(data=data)
        assert not serializer.is_valid()
        assert "priority" in serializer.errors


class TestTaskSerializerOrdering:
    """Test TaskSerializer ordering logic."""

    @pytest.mark.django_db
    def test_above_task_and_below_task_mutually_exclusive(self, section):
        """Test that above_task and below_task cannot both be specified."""
        task1 = TaskFactory(section=section, order=1)
        task2 = TaskFactory(section=section, order=2)

        data = {
            "title": fake.sentence(),
            "section": section.id,
            "above_task": task1.id,
            "below_task": task2.id,
        }
        serializer = TaskSerializer(data=data)
        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors
        assert "You can only specify one of 'above_task' or 'below_task'." in str(
            serializer.errors
        )

    @pytest.mark.django_db
    def test_above_task_sets_correct_order(self, section):
        """Test that above_task sets the correct order."""
        existing_task = TaskFactory(section=section, order=5)

        data = {
            "title": fake.sentence(),
            "section": section.id,
            "above_task": existing_task.id,
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["order"] == existing_task.order

    @pytest.mark.django_db
    def test_below_task_sets_correct_order(self, section):
        """Test that below_task sets the correct order."""
        existing_task = TaskFactory(section=section, order=5)

        data = {
            "title": fake.sentence(),
            "section": section.id,
            "below_task": existing_task.id,
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["order"] == existing_task.order + 1

    @pytest.mark.django_db
    def test_invalid_above_task_fails_validation(self, section):
        """Test that invalid above_task ID fails validation."""
        data = {
            "title": fake.sentence(),
            "section": section.id,
            "above_task": 99999,
        }
        serializer = TaskSerializer(data=data)
        assert not serializer.is_valid()
        assert "above_task" in serializer.errors

    @pytest.mark.django_db
    def test_invalid_below_task_fails_validation(self, section):
        """Test that invalid below_task ID fails validation."""
        data = {
            "title": fake.sentence(),
            "section": section.id,
            "below_task": 99999,
        }
        serializer = TaskSerializer(data=data)
        assert not serializer.is_valid()
        assert "below_task" in serializer.errors


class TestTaskSerializerRecurring:
    """Test TaskSerializer recurring task functionality."""

    @pytest.mark.django_db
    @patch("upoutodo.utils.calculate_next_due_date")
    def test_due_date_calculated_from_rrule_and_dtstart(self, mock_calculate, section):
        """Test that due_date is calculated when rrule and dtstart are provided."""
        expected_due_date = datetime.now(timezone.utc)
        mock_calculate.return_value = expected_due_date

        data = {
            "title": fake.sentence(),
            "section": section.id,
            "rrule": "FREQ=DAILY",
            "dtstart": datetime.now(timezone.utc),
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["due_date"] == expected_due_date
        mock_calculate.assert_called_once_with(data["rrule"], data["dtstart"])

    @pytest.mark.django_db
    def test_no_due_date_calculation_without_rrule(self, section):
        """Test that due_date is not calculated when rrule is missing."""
        data = {
            "title": fake.sentence(),
            "section": section.id,
            "dtstart": datetime.now(timezone.utc),
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()
        assert "due_date" not in serializer.validated_data

    @pytest.mark.django_db
    def test_no_due_date_calculation_without_dtstart(self, section):
        """Test that due_date is not calculated when dtstart is missing."""
        data = {
            "title": fake.sentence(),
            "section": section.id,
            "rrule": "FREQ=DAILY",
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()
        assert "due_date" not in serializer.validated_data

    @pytest.mark.django_db
    @patch("upoutodo.utils.calculate_next_due_date")
    def test_no_due_date_when_calculation_returns_none(self, mock_calculate, section):
        """Test that due_date is not set when calculation returns None."""
        mock_calculate.return_value = None

        data = {
            "title": fake.sentence(),
            "section": section.id,
            "rrule": "INVALID_RRULE",
            "dtstart": datetime.now(timezone.utc),
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()
        assert "due_date" not in serializer.validated_data


class TestTaskSerializerMethods:
    """Test TaskSerializer serializer methods."""

    @pytest.mark.django_db
    def test_get_project_title(self, task):
        """Test get_project_title method."""
        serializer = TaskSerializer(task)
        assert serializer.get_project_title(task) == task.section.project.title

    @pytest.mark.django_db
    def test_get_section_title_normal_section(self, task):
        """Test get_section_title method with normal section."""
        task.section.title = "Custom Section"
        task.section.save()

        serializer = TaskSerializer(task)
        assert serializer.get_section_title(task) == "Custom Section"

    @pytest.mark.django_db
    def test_get_section_title_default_section(self, task):
        """Test get_section_title method with default section title."""
        task.section.title = Project.DEFAULT_PROJECT_SECTION_TITLE
        task.section.save()

        serializer = TaskSerializer(task)
        assert serializer.get_section_title(task) is None

    @pytest.mark.django_db
    def test_get_comments_count_no_comments(self, task):
        """Test get_comments_count method with no comments."""
        serializer = TaskSerializer(task)
        assert serializer.get_comments_count(task) == 0

    @pytest.mark.django_db
    def test_get_comments_count_with_comments(self, task):
        """Test get_comments_count method with comments."""
        content_type = ContentType.objects.get_for_model(task)

        # Create some comments
        Comment.objects.create(
            content_type=content_type,
            object_pk=task.pk,
            comment="Test comment 1",
            site_id=1,
        )
        Comment.objects.create(
            content_type=content_type,
            object_pk=task.pk,
            comment="Test comment 2",
            site_id=1,
        )

        serializer = TaskSerializer(task)
        assert serializer.get_comments_count(task) == 2


class TestTaskSerializerTags:
    """Test TaskSerializer tag handling."""

    @pytest.mark.django_db
    def test_tags_field_optional(self, section):
        """Test that tags field is optional."""
        data = {"title": fake.sentence(), "section": section.id}
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()

    @pytest.mark.django_db
    def test_tags_field_accepts_list(self, section):
        """Test that tags field accepts a list of tag names."""
        data = {
            "title": fake.sentence(),
            "section": section.id,
            "tags": ["tag1", "tag2", "tag3"],
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["tags"] == ["tag1", "tag2", "tag3"]

    @pytest.mark.django_db
    def test_update_creates_tags_for_user(self, task, mock_request):
        """Test that update method creates tags for the user."""
        serializer = TaskSerializer(task, context={"request": mock_request})

        # Update with tags
        validated_data = {"tags": ["new_tag1", "new_tag2"]}
        updated_task = serializer.update(task, validated_data)

        # Check that tags were created and assigned
        assert updated_task.tags.count() == 2
        tag_names = [tag.name for tag in updated_task.tags.all()]
        assert "new_tag1" in tag_names
        assert "new_tag2" in tag_names

        # Check that tags were created with correct user
        for tag in Tag.objects.filter(name__in=["new_tag1", "new_tag2"]):
            assert tag.created_by == mock_request.user

    @pytest.mark.django_db
    def test_update_reuses_existing_tags(self, task, mock_request):
        """Test that update method reuses existing tags."""
        # Create an existing tag
        existing_tag = Tag.objects.create(
            name="existing_tag", created_by=mock_request.user
        )

        serializer = TaskSerializer(task, context={"request": mock_request})

        # Update with existing and new tags
        validated_data = {"tags": ["existing_tag", "new_tag"]}
        updated_task = serializer.update(task, validated_data)

        # Check that existing tag was reused
        assert updated_task.tags.filter(name="existing_tag").first() == existing_tag

        # Check that new tag was created
        assert updated_task.tags.filter(name="new_tag").exists()

    @pytest.mark.django_db
    def test_update_without_tags_preserves_existing(self, task, mock_request):
        """Test that update without tags preserves existing tags."""
        # Add some tags to the task
        tag1 = Tag.objects.create(name="tag1", created_by=mock_request.user)
        tag2 = Tag.objects.create(name="tag2", created_by=mock_request.user)
        task.tags.set([tag1, tag2])

        serializer = TaskSerializer(task, context={"request": mock_request})

        # Update without tags
        validated_data = {"title": "Updated title"}
        updated_task = serializer.update(task, validated_data)

        # Check that existing tags are preserved
        assert updated_task.tags.count() == 2
        assert tag1 in updated_task.tags.all()
        assert tag2 in updated_task.tags.all()

    @pytest.mark.django_db
    def test_update_with_empty_tags_clears_tags(self, task, mock_request):
        """Test that update with empty tags list clears all tags."""
        # Add some tags to the task
        tag1 = Tag.objects.create(name="tag1", created_by=mock_request.user)
        tag2 = Tag.objects.create(name="tag2", created_by=mock_request.user)
        task.tags.set([tag1, tag2])

        serializer = TaskSerializer(task, context={"request": mock_request})

        # Update with empty tags
        validated_data = {"tags": []}
        updated_task = serializer.update(task, validated_data)

        # Check that tags were cleared
        assert updated_task.tags.count() == 0


# Note: due_date is read_only and calculated from rrule/dtstart, so direct validation is not applicable
