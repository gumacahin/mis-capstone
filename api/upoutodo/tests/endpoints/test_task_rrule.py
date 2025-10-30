import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.models import Task
from upoutodo.tests.factories import ProjectSectionFactory, UserFactory


@pytest.mark.django_db
class TestTaskRRuleEndpoints:
    """Test RRule functionality in Task API endpoints."""

    def setup_method(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = UserFactory()
        self.section = ProjectSectionFactory(project__created_by=self.user)
        self.client.force_authenticate(user=self.user)

    def test_create_task_with_rrule_fields(self):
        """Test creating a task with RRule fields via API."""
        url = "/api/tasks/"
        data = {
            "title": "Recurring API Task",
            "section": self.section.id,
            "rrule": "FREQ=DAILY;INTERVAL=2",
            "dtstart": "2024-01-01T09:00:00Z",
            "anchor_mode": "SCHEDULED",
        }

        response = self.client.post(url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["rrule"] == "FREQ=DAILY;INTERVAL=2"
        assert response.data["anchor_mode"] == "SCHEDULED"

        # Verify in database
        task = Task.objects.get(id=response.data["id"])
        assert task.rrule == "FREQ=DAILY;INTERVAL=2"
        assert task.anchor_mode == "SCHEDULED"

    def test_create_task_without_rrule_fields(self):
        """Test creating a task without RRule fields via API."""
        url = "/api/tasks/"
        data = {
            "title": "Non-recurring API Task",
            "section": self.section.id,
        }

        response = self.client.post(url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["rrule"] is None
        assert response.data["dtstart"] is None
        assert response.data["anchor_mode"] is None

    def test_update_task_rrule_fields(self):
        """Test updating RRule fields via API."""
        task = Task.objects.create(
            title="Task to Update",
            section=self.section,
            rrule="FREQ=DAILY",
            anchor_mode=Task.AnchorMode.SCHEDULED,
        )

        url = f"/api/tasks/{task.id}/"
        data = {
            "rrule": "FREQ=WEEKLY;BYDAY=MO,WE,FR",
            "anchor_mode": "COMPLETED",
        }

        response = self.client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["rrule"] == "FREQ=WEEKLY;BYDAY=MO,WE,FR"
        assert response.data["anchor_mode"] == "COMPLETED"

        # Verify in database
        task.refresh_from_db()
        assert task.rrule == "FREQ=WEEKLY;BYDAY=MO,WE,FR"
        assert task.anchor_mode == "COMPLETED"

    def test_retrieve_task_with_rrule_fields(self):
        """Test retrieving a task with RRule fields via API."""
        task = Task.objects.create(
            title="Recurring Task",
            section=self.section,
            rrule="FREQ=MONTHLY;BYMONTHDAY=15",
            dtstart=timezone.now(),
            anchor_mode=Task.AnchorMode.COMPLETED,
        )

        url = f"/api/tasks/{task.id}/"
        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["rrule"] == "FREQ=MONTHLY;BYMONTHDAY=15"
        assert response.data["anchor_mode"] == "COMPLETED"
        assert "dtstart" in response.data

    def test_list_tasks_includes_rrule_fields(self):
        """Test that task list includes RRule fields."""
        Task.objects.create(
            title="Recurring Task 1",
            section=self.section,
            rrule="FREQ=DAILY",
            anchor_mode=Task.AnchorMode.SCHEDULED,
        )
        Task.objects.create(
            title="Non-recurring Task",
            section=self.section,
        )

        url = "/api/tasks/"
        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

        # Check that RRule fields are included
        for task_data in response.data["results"]:
            assert "rrule" in task_data
            assert "dtstart" in task_data
            assert "anchor_mode" in task_data

    def test_invalid_anchor_mode_returns_error(self):
        """Test that invalid anchor_mode returns validation error."""
        url = "/api/tasks/"
        data = {
            "title": "Task with Invalid Anchor Mode",
            "section": self.section.id,
            "anchor_mode": "INVALID_MODE",
        }

        response = self.client.post(url, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "anchor_mode" in response.data

    def test_bulk_update_with_rrule_fields(self):
        """Test bulk update endpoint with RRule fields."""
        task1 = Task.objects.create(title="Task 1", section=self.section)
        task2 = Task.objects.create(title="Task 2", section=self.section)

        url = "/api/tasks/bulk_update/"
        data = [
            {
                "id": task1.id,
                "rrule": "FREQ=DAILY",
                "anchor_mode": "SCHEDULED",
            },
            {
                "id": task2.id,
                "rrule": "FREQ=WEEKLY",
                "anchor_mode": "COMPLETED",
            },
        ]

        response = self.client.put(url, data, format="json")

        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify updates
        task1.refresh_from_db()
        task2.refresh_from_db()
        assert task1.rrule == "FREQ=DAILY"
        assert task1.anchor_mode == "SCHEDULED"
        assert task2.rrule == "FREQ=WEEKLY"
        assert task2.anchor_mode == "COMPLETED"

    def test_duplicate_task_copies_rrule_fields(self):
        """Test that duplicating a task copies RRule fields."""
        task = Task.objects.create(
            title="Original Task",
            section=self.section,
            rrule="FREQ=WEEKLY;BYDAY=TU,TH",
            anchor_mode=Task.AnchorMode.SCHEDULED,
        )

        url = f"/api/tasks/{task.id}/duplicate/"
        response = self.client.post(url)

        assert response.status_code == status.HTTP_201_CREATED

        # Verify duplicate has same RRule fields
        duplicated_tasks = Task.objects.filter(
            title="Original Task",
            section=self.section,
        ).order_by("id")

        assert duplicated_tasks.count() == 2
        original, duplicate = duplicated_tasks

        assert duplicate.rrule == original.rrule
        assert duplicate.anchor_mode == original.anchor_mode
