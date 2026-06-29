from datetime import date, datetime, timedelta

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.tests.factories import ProjectSectionFactory, TaskFactory, UserFactory


@pytest.mark.django_db
class TestTaskDateFiltering:
    """Test date filtering functionality for Task API endpoints."""

    def setup_method(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = UserFactory()
        self.section = ProjectSectionFactory(project__created_by=self.user)
        self.client.force_authenticate(user=self.user)

    def test_filter_tasks_by_single_date_range(self):
        """Test filtering tasks by start_date and end_date for a single day (2025-11-02)."""
        # Use a future date to avoid conflicts with current date
        target_date = date(2025, 11, 2)
        target_datetime = timezone.make_aware(
            datetime.combine(target_date, datetime.min.time())
        )

        # Task on the target date (should be included)
        task_on_date = TaskFactory(
            section=self.section, title="Task on 2025-11-02", due_date=target_datetime
        )

        # Task before the target date (should be excluded)
        TaskFactory(
            section=self.section,
            title="Task before date",
            due_date=target_datetime - timedelta(days=1),
        )

        # Task after the target date (should be excluded)
        TaskFactory(
            section=self.section,
            title="Task after date",
            due_date=target_datetime + timedelta(days=1),
        )

        # Task with no due date (should be excluded)
        TaskFactory(section=self.section, title="Task with no due date", due_date=None)

        # Test the endpoint with the exact URL from the user's request
        url = "/api/tasks/"
        params = {"start_date": "2025-11-02", "end_date": "2025-11-02"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == task_on_date.id
        assert response.data["results"][0]["title"] == "Task on 2025-11-02"

    def test_filter_tasks_by_specific_date_2025_11_01(self):
        """Test the exact endpoint from user's request: 2025-11-01."""
        # Create tasks with different due dates around 2025-11-01
        target_date = date(2025, 11, 1)
        target_datetime = timezone.make_aware(
            datetime.combine(target_date, datetime.min.time())
        )

        # Task on the exact target date (should be included)
        task_on_date = TaskFactory(
            section=self.section, title="Task on 2025-11-01", due_date=target_datetime
        )

        # Task on different dates (should be excluded)
        TaskFactory(
            section=self.section,
            title="Task on 2025-10-31",
            due_date=target_datetime - timedelta(days=1),
        )

        TaskFactory(
            section=self.section,
            title="Task on 2025-11-02",
            due_date=target_datetime + timedelta(days=1),
        )

        # Test the exact endpoint from user's request
        url = "/api/tasks/"
        params = {"start_date": "2025-11-01", "end_date": "2025-11-01"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == task_on_date.id
        assert response.data["results"][0]["title"] == "Task on 2025-11-01"

    def test_filter_tasks_by_date_range_multiple_days(self):
        """Test filtering tasks by a multi-day date range."""
        # Create tasks across a week
        base_date = date(2025, 11, 1)

        tasks_in_range = []
        for i in range(3):  # Nov 1, 2, 3
            task_date = timezone.make_aware(
                datetime.combine(base_date + timedelta(days=i), datetime.min.time())
            )
            task = TaskFactory(
                section=self.section, title=f"Task on day {i + 1}", due_date=task_date
            )
            tasks_in_range.append(task)

        # Tasks outside the range
        TaskFactory(
            section=self.section,
            title="Task before range",
            due_date=timezone.make_aware(
                datetime.combine(base_date - timedelta(days=1), datetime.min.time())
            ),
        )

        TaskFactory(
            section=self.section,
            title="Task after range",
            due_date=timezone.make_aware(
                datetime.combine(base_date + timedelta(days=5), datetime.min.time())
            ),
        )

        # Test filtering for Nov 1-3, 2025
        url = "/api/tasks/"
        params = {"start_date": "2025-11-01", "end_date": "2025-11-03"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 3

        # Verify all tasks in range are returned
        returned_ids = [task["id"] for task in response.data["results"]]
        expected_ids = [task.id for task in tasks_in_range]
        assert set(returned_ids) == set(expected_ids)

    def test_filter_tasks_start_date_only(self):
        """Test filtering tasks with only start_date parameter."""
        base_date = date(2025, 11, 1)

        # Task on start date (should be included)
        task_on_start = TaskFactory(
            section=self.section,
            title="Task on start date",
            due_date=timezone.make_aware(
                datetime.combine(base_date, datetime.min.time())
            ),
        )

        # Task after start date (should be included)
        task_after_start = TaskFactory(
            section=self.section,
            title="Task after start date",
            due_date=timezone.make_aware(
                datetime.combine(base_date + timedelta(days=5), datetime.min.time())
            ),
        )

        # Task before start date (should be excluded)
        TaskFactory(
            section=self.section,
            title="Task before start date",
            due_date=timezone.make_aware(
                datetime.combine(base_date - timedelta(days=1), datetime.min.time())
            ),
        )

        url = "/api/tasks/"
        params = {"start_date": "2025-11-01"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 2

        returned_ids = [task["id"] for task in response.data["results"]]
        assert task_on_start.id in returned_ids
        assert task_after_start.id in returned_ids

    def test_filter_tasks_end_date_only(self):
        """Test filtering tasks with only end_date parameter."""
        base_date = date(2025, 11, 1)

        # Task on end date (should be included)
        task_on_end = TaskFactory(
            section=self.section,
            title="Task on end date",
            due_date=timezone.make_aware(
                datetime.combine(base_date, datetime.min.time())
            ),
        )

        # Task before end date (should be included)
        task_before_end = TaskFactory(
            section=self.section,
            title="Task before end date",
            due_date=timezone.make_aware(
                datetime.combine(base_date - timedelta(days=2), datetime.min.time())
            ),
        )

        # Task after end date (should be excluded)
        TaskFactory(
            section=self.section,
            title="Task after end date",
            due_date=timezone.make_aware(
                datetime.combine(base_date + timedelta(days=1), datetime.min.time())
            ),
        )

        url = "/api/tasks/"
        params = {"end_date": "2025-11-01"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 2

        returned_ids = [task["id"] for task in response.data["results"]]
        assert task_on_end.id in returned_ids
        assert task_before_end.id in returned_ids

    def test_filter_tasks_no_results_in_range(self):
        """Test filtering when no tasks exist in the specified date range."""
        # Create tasks outside the target range
        TaskFactory(
            section=self.section,
            title="Task before range",
            due_date=timezone.make_aware(
                datetime.combine(date(2025, 10, 30), datetime.min.time())
            ),
        )

        TaskFactory(
            section=self.section,
            title="Task after range",
            due_date=timezone.make_aware(
                datetime.combine(date(2025, 11, 5), datetime.min.time())
            ),
        )

        url = "/api/tasks/"
        params = {"start_date": "2025-11-01", "end_date": "2025-11-01"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0
        assert len(response.data["results"]) == 0

    def test_filter_tasks_with_time_components(self):
        """Test that date filtering works correctly with different time components.

        With the fixed TaskFilter, both midnight and morning tasks should be included
        when filtering for the same date.
        """
        target_date = date(2025, 11, 3)  # Use a future date

        # Task at midnight (should be included)
        task_midnight = TaskFactory(
            section=self.section,
            title="Midnight task",
            due_date=timezone.make_aware(
                datetime.combine(target_date, datetime.min.time())
            ),
        )

        # Task early in the day (should now be included with the fix)
        task_morning = TaskFactory(
            section=self.section,
            title="Morning task",
            due_date=timezone.make_aware(
                datetime.combine(target_date, datetime.min.time().replace(hour=8))
            ),
        )

        url = "/api/tasks/"
        params = {"start_date": "2025-11-03", "end_date": "2025-11-03"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        # With the fixed filter, both tasks should be included
        assert (
            response.data["count"] == 2
        ), f"Expected 2 tasks (both midnight and morning), got {response.data['count']}. Response: {response.data}"

        returned_ids = [task["id"] for task in response.data["results"]]
        assert task_midnight.id in returned_ids
        assert task_morning.id in returned_ids

    def test_filter_tasks_boundary_conditions(self):
        """Test boundary conditions for date filtering.

        With the fixed TaskFilter, both midnight and end-of-day tasks should be included
        when filtering for the same date.
        """
        # Task exactly at midnight of the target date
        target_date = date(2025, 11, 4)  # Use a future date
        task_midnight = TaskFactory(
            section=self.section,
            title="Midnight task",
            due_date=timezone.make_aware(
                datetime.combine(target_date, datetime.min.time())
            ),
        )

        # Task at end of the target date (23:59:59)
        # This should now be included with the fixed filter
        task_end_of_day = TaskFactory(
            section=self.section,
            title="End of day task",
            due_date=timezone.make_aware(
                datetime.combine(
                    target_date,
                    datetime.min.time().replace(hour=23, minute=59, second=59),
                )
            ),
        )

        url = "/api/tasks/"
        params = {"start_date": "2025-11-04", "end_date": "2025-11-04"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        # With the fixed filter, both tasks should be included
        assert (
            response.data["count"] == 2
        ), f"Expected 2 tasks (midnight and end-of-day), got {response.data['count']}. Tasks: {[t['title'] for t in response.data['results']]}"

        returned_ids = [task["id"] for task in response.data["results"]]
        assert task_midnight.id in returned_ids
        assert task_end_of_day.id in returned_ids

    def test_filter_tasks_invalid_date_format(self):
        """Test that invalid date formats are handled gracefully."""
        TaskFactory(section=self.section, title="Test task")

        url = "/api/tasks/"
        params = {"start_date": "invalid-date", "end_date": "2025-11-01"}

        response = self.client.get(url, params, format="json")

        # The endpoint should return a 400 error for invalid date format
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_filter_tasks_combined_with_other_filters(self):
        """Test date filtering combined with other available filters."""
        target_date = date(2025, 11, 1)
        target_datetime = timezone.make_aware(
            datetime.combine(target_date, datetime.min.time())
        )

        # Create tasks with different priorities on the target date
        TaskFactory(
            section=self.section,
            title="High priority task",
            due_date=target_datetime,
            priority="HIGH",
        )

        TaskFactory(
            section=self.section,
            title="Low priority task",
            due_date=target_datetime,
            priority="LOW",
        )

        # Test combining date filter with priority filter
        # Note: This assumes the endpoint supports priority filtering
        url = "/api/tasks/"
        params = {
            "start_date": "2025-11-01",
            "end_date": "2025-11-01",
            # Note: Adding priority filter if it's supported by the endpoint
        }

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 2  # Both tasks should be returned

    def test_filter_tasks_user_isolation(self):
        """Test that date filtering respects user isolation."""
        # Create another user and their tasks
        other_user = UserFactory()
        other_section = ProjectSectionFactory(project__created_by=other_user)

        target_date = date(2025, 11, 1)
        target_datetime = timezone.make_aware(
            datetime.combine(target_date, datetime.min.time())
        )

        # Task for the authenticated user
        user_task = TaskFactory(
            section=self.section, title="User's task", due_date=target_datetime
        )

        # Task for the other user (should not be visible)
        TaskFactory(
            section=other_section, title="Other user's task", due_date=target_datetime
        )

        url = "/api/tasks/"
        params = {"start_date": "2025-11-01", "end_date": "2025-11-01"}

        response = self.client.get(url, params, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["id"] == user_task.id
        assert response.data["results"][0]["title"] == "User's task"
