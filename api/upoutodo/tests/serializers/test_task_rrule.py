import pytest
from django.utils import timezone
from rest_framework.test import APIRequestFactory

from upoutodo.models import Task
from upoutodo.serializers import TaskSerializer
from upoutodo.tests.factories import ProjectSectionFactory, UserFactory


@pytest.mark.django_db
class TestTaskSerializerRRuleFields:
    """Test RRule-related fields in the TaskSerializer."""

    def setup_method(self):
        """Set up test data."""
        self.factory = APIRequestFactory()
        self.user = UserFactory()
        self.section = ProjectSectionFactory(project__created_by=self.user)

    def test_serializer_includes_rrule_fields(self):
        """Test that serializer includes RRule fields in output."""
        task = Task.objects.create(
            title="Recurring Task",
            section=self.section,
            rrule="FREQ=DAILY",
            dtstart=timezone.now(),
            anchor_mode=Task.AnchorMode.SCHEDULED,
        )

        serializer = TaskSerializer(task)
        data = serializer.data

        assert "rrule" in data
        assert "dtstart" in data
        assert "anchor_mode" in data
        assert data["rrule"] == "FREQ=DAILY"
        assert data["anchor_mode"] == "SCHEDULED"

    def test_serializer_accepts_rrule_fields_on_create(self):
        """Test that serializer accepts RRule fields when creating a task."""
        data = {
            "title": "New Recurring Task",
            "section": self.section.id,
            "rrule": "FREQ=WEEKLY;BYDAY=MO",
            "dtstart": "2024-01-01T09:00:00Z",
            "anchor_mode": "COMPLETED",
        }

        request = self.factory.post("/tasks/")
        request.user = self.user

        serializer = TaskSerializer(data=data, context={"request": request})
        assert serializer.is_valid(), serializer.errors

        task = serializer.save()
        assert task.rrule == "FREQ=WEEKLY;BYDAY=MO"
        assert task.anchor_mode == "COMPLETED"

    def test_serializer_accepts_null_rrule_fields(self):
        """Test that serializer accepts null RRule fields."""
        data = {
            "title": "Non-recurring Task",
            "section": self.section.id,
            "rrule": None,
            "dtstart": None,
            "anchor_mode": None,
        }

        request = self.factory.post("/tasks/")
        request.user = self.user

        serializer = TaskSerializer(data=data, context={"request": request})
        assert serializer.is_valid(), serializer.errors

        task = serializer.save()
        assert task.rrule == ""  # Model stores empty string, not None
        assert task.dtstart is None  # DateTimeField can be None
        assert task.anchor_mode == ""  # Model stores empty string, not None

    def test_serializer_updates_rrule_fields(self):
        """Test that serializer can update RRule fields."""
        task = Task.objects.create(
            title="Task to Update",
            section=self.section,
            rrule="FREQ=DAILY",
            anchor_mode=Task.AnchorMode.SCHEDULED,
        )

        update_data = {
            "rrule": "FREQ=WEEKLY",
            "anchor_mode": "COMPLETED",
        }

        request = self.factory.patch(f"/tasks/{task.id}/")
        request.user = self.user

        serializer = TaskSerializer(
            task, data=update_data, partial=True, context={"request": request}
        )
        assert serializer.is_valid(), serializer.errors

        updated_task = serializer.save()
        assert updated_task.rrule == "FREQ=WEEKLY"
        assert updated_task.anchor_mode == "COMPLETED"

    def test_serializer_validates_anchor_mode_choices(self):
        """Test that serializer validates anchor_mode choices."""
        data = {
            "title": "Task with Invalid Anchor Mode",
            "section": self.section.id,
            "anchor_mode": "INVALID_CHOICE",
        }

        request = self.factory.post("/tasks/")
        request.user = self.user

        serializer = TaskSerializer(data=data, context={"request": request})
        assert not serializer.is_valid()
        assert "anchor_mode" in serializer.errors

    def test_admin_serializer_includes_rrule_fields(self):
        """Test that TaskAdminSerializer includes RRule fields."""
        from upoutodo.serializers import TaskAdminSerializer

        task = Task.objects.create(
            title="Admin Task",
            section=self.section,
            rrule="FREQ=MONTHLY",
            anchor_mode=Task.AnchorMode.SCHEDULED,
        )

        serializer = TaskAdminSerializer(task)
        data = serializer.data

        assert "rrule" in data
        assert "dtstart" in data
        assert "anchor_mode" in data
        assert data["rrule"] == "FREQ=MONTHLY"

    def test_serializer_handles_complex_rrule(self):
        """Test that serializer handles complex RRule strings."""
        complex_rrule = "FREQ=WEEKLY;BYDAY=MO,WE,FR;UNTIL=20241231T235959Z"

        data = {
            "title": "Complex Recurring Task",
            "section": self.section.id,
            "rrule": complex_rrule,
            "dtstart": "2024-01-01T09:00:00Z",
            "anchor_mode": "SCHEDULED",
        }

        request = self.factory.post("/tasks/")
        request.user = self.user

        serializer = TaskSerializer(data=data, context={"request": request})
        assert serializer.is_valid(), serializer.errors

        task = serializer.save()
        assert task.rrule == complex_rrule
