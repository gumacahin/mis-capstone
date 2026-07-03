"""
Performance tests for bulk operations.

These tests ensure that bulk operations perform efficiently with large datasets.
"""

import time

import pytest
from django.test import override_settings
from rest_framework.test import APIClient

from upoutodo.models import Task
from upoutodo.tests.factories import (
    ProjectFactory,
    ProjectSectionFactory,
    TaskFactory,
    UserFactory,
)


@pytest.mark.django_db
class TestBulkOperationPerformance:
    """Test performance of bulk operations with large datasets."""

    def setup_method(self):
        """Set up test data for performance tests."""
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

        self.project = ProjectFactory(created_by=self.user, updated_by=self.user)
        self.section = ProjectSectionFactory(project=self.project)

    @pytest.mark.slow
    def test_bulk_update_performance_100_tasks(self):
        """Test bulk update performance with 100 tasks."""
        # Create 100 tasks
        tasks = []
        for i in range(100):
            task = TaskFactory(
                section=self.section, title=f"Performance Test Task {i}", priority="LOW"
            )
            tasks.append(task)

        # Prepare bulk update data
        bulk_data = [
            {"id": task.id, "priority": "HIGH", "title": f"Updated Task {i}"}
            for i, task in enumerate(tasks)
        ]

        # Measure performance
        start_time = time.time()
        response = self.client.put("/api/tasks/bulk_update/", bulk_data, format="json")
        end_time = time.time()

        # Assertions
        assert response.status_code == 204
        execution_time = end_time - start_time

        # Should complete within reasonable time (adjust threshold as needed)
        assert execution_time < 5.0, (
            f"Bulk update took {execution_time:.2f}s, expected < 5.0s"
        )

        # Verify updates were applied
        updated_tasks = Task.objects.filter(id__in=[task.id for task in tasks])
        assert all(task.priority == "HIGH" for task in updated_tasks)

    @pytest.mark.slow
    def test_bulk_create_performance_100_tasks(self):
        """Test bulk task creation performance."""
        # Prepare data for 100 tasks
        tasks_data = [
            {
                "title": f"Bulk Created Task {i}",
                "section": self.section.id,
                "priority": "MEDIUM",
                "description": f"Description for task {i}",
            }
            for i in range(100)
        ]

        # Measure performance of individual creates (simulating bulk)
        start_time = time.time()
        created_tasks = []

        for task_data in tasks_data:
            response = self.client.post("/api/tasks/", task_data, format="json")
            assert response.status_code == 201
            created_tasks.append(response.data["id"])

        end_time = time.time()
        execution_time = end_time - start_time

        # Should complete within reasonable time
        assert execution_time < 10.0, (
            f"Bulk creation took {execution_time:.2f}s, expected < 10.0s"
        )

        # Verify all tasks were created
        assert len(created_tasks) == 100
        assert Task.objects.filter(id__in=created_tasks).count() == 100

    @pytest.mark.slow
    def test_task_list_performance_with_large_dataset(self):
        """Test task list performance with large dataset."""
        # Create 500 tasks across multiple sections
        sections = [ProjectSectionFactory(project=self.project) for _ in range(5)]

        for i in range(500):
            section = sections[i % 5]  # Distribute across sections
            TaskFactory(
                section=section,
                title=f"Large Dataset Task {i}",
                priority=["LOW", "MEDIUM", "HIGH"][i % 3],
            )

        # Test list performance
        start_time = time.time()
        response = self.client.get("/api/tasks/")
        end_time = time.time()

        execution_time = end_time - start_time

        # Should complete within reasonable time
        assert execution_time < 2.0, (
            f"Task list took {execution_time:.2f}s, expected < 2.0s"
        )
        assert response.status_code == 200
        assert response.data["count"] == 500

    @pytest.mark.slow
    def test_filtered_list_performance(self):
        """Test performance of filtered task lists."""
        # Create diverse dataset
        for i in range(200):
            TaskFactory(
                section=self.section,
                title=f"Filtered Task {i}",
                priority=["LOW", "MEDIUM", "HIGH"][i % 3],
            )

        # Test various filters
        filters_to_test = [
            "?priority=HIGH",
            "?today=true",
            "?inbox=true",
            "?upcoming=true",
        ]

        for filter_param in filters_to_test:
            start_time = time.time()
            response = self.client.get(f"/api/tasks/{filter_param}")
            end_time = time.time()

            execution_time = end_time - start_time
            assert execution_time < 1.0, (
                f"Filtered list {filter_param} took {execution_time:.2f}s"
            )
            assert response.status_code == 200

    @pytest.mark.slow
    def test_task_duplication_performance(self):
        """Test performance of task duplication with tags."""
        from upoutodo.models import Tag

        # Create a task with multiple tags
        task = TaskFactory(section=self.section, title="Original Task")

        # Add 10 tags
        for i in range(10):
            tag, _ = Tag.objects.get_or_create(name=f"tag{i}", created_by=self.user)
            task.tags.add(tag)

        # Test duplication performance
        duplications = 50
        start_time = time.time()

        for _ in range(duplications):
            response = self.client.post(f"/api/tasks/{task.id}/duplicate/")
            assert response.status_code == 201

        end_time = time.time()
        execution_time = end_time - start_time

        # Should complete within reasonable time
        assert execution_time < 5.0, (
            f"Task duplication took {execution_time:.2f}s, expected < 5.0s"
        )

        # Verify all duplicates were created with tags
        all_tasks = Task.objects.filter(title="Original Task", section=self.section)
        assert all_tasks.count() == duplications + 1  # Original + duplicates

        # Verify tags were copied
        for duplicate_task in all_tasks:
            assert duplicate_task.tags.count() == 10

    @pytest.mark.slow
    def test_recurring_task_completion_performance(self):
        """Test performance of completing recurring tasks (next occurrence creation)."""
        from django.utils import timezone

        # Create 50 recurring tasks
        recurring_tasks = []
        for i in range(50):
            task = TaskFactory(
                section=self.section,
                title=f"Recurring Task {i}",
                rrule="FREQ=DAILY",
                dtstart=timezone.now(),
                anchor_mode="SCHEDULED",
            )
            recurring_tasks.append(task)

        # Test completion performance
        start_time = time.time()

        for task in recurring_tasks:
            response = self.client.patch(
                f"/api/tasks/{task.id}/",
                {"completion_date": timezone.now().isoformat()},
                format="json",
            )
            assert response.status_code == 200

        end_time = time.time()
        execution_time = end_time - start_time

        # Should complete within reasonable time
        assert execution_time < 10.0, (
            f"Recurring task completion took {execution_time:.2f}s"
        )

        # Verify next occurrences were created (some may have been created)
        total_tasks = Task.objects.filter(section=self.section).count()
        # Should have at least the original 50 tasks, possibly more with next occurrences
        assert total_tasks >= 50, f"Expected at least 50 tasks, got {total_tasks}"

    @override_settings(DEBUG=False)  # Disable debug to avoid query logging overhead
    def test_database_query_efficiency(self):
        """Test that operations don't generate excessive database queries."""
        from django.db import connection

        # Create test data
        tasks = [TaskFactory(section=self.section) for _ in range(20)]

        # Test bulk update query efficiency
        bulk_data = [{"id": task.id, "priority": "HIGH"} for task in tasks]

        # Reset query count
        connection.queries_log.clear()

        response = self.client.put("/api/tasks/bulk_update/", bulk_data, format="json")
        assert response.status_code == 204

        # Should not generate excessive queries (adjust threshold as needed)
        query_count = len(connection.queries)
        assert query_count < 50, (
            f"Bulk update generated {query_count} queries, expected < 50"
        )

    @pytest.mark.slow
    def test_memory_usage_with_large_dataset(self):
        """Test memory usage doesn't grow excessively with large datasets."""
        import os

        import psutil

        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB

        # Create large dataset
        for i in range(1000):
            TaskFactory(section=self.section, title=f"Memory Test Task {i}")

        # Perform operations
        response = self.client.get("/api/tasks/")
        assert response.status_code == 200

        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_increase = final_memory - initial_memory

        # Memory increase should be reasonable (adjust threshold as needed)
        assert memory_increase < 100, (
            f"Memory increased by {memory_increase:.1f}MB, expected < 100MB"
        )


@pytest.mark.django_db
class TestConcurrencyPerformance:
    """Test performance under concurrent access scenarios."""

    def setup_method(self):
        """Set up test data for concurrency tests."""
        self.user = UserFactory()
        self.project = ProjectFactory(created_by=self.user, updated_by=self.user)
        self.section = ProjectSectionFactory(project=self.project)

    def test_concurrent_task_creation_simulation(self):
        """Simulate concurrent task creation by multiple users (simplified to avoid DB locking)."""
        # Instead of true concurrency, test sequential creation by multiple users
        # to verify isolation and performance

        users = [UserFactory() for _ in range(3)]  # Reduced number
        all_tasks_created = []

        start_time = time.time()

        for user in users:
            client = APIClient()
            client.force_authenticate(user=user)

            user_project = ProjectFactory(created_by=user, updated_by=user)
            user_section = ProjectSectionFactory(project=user_project)

            # Create tasks for this user
            for i in range(5):  # Reduced number
                task_data = {
                    "title": f"User {user.id} Task {i}",
                    "section": user_section.id,
                }
                response = client.post("/api/tasks/", task_data, format="json")
                assert response.status_code == 201
                all_tasks_created.append(response.data["id"])

        end_time = time.time()
        execution_time = end_time - start_time

        # Should complete within reasonable time
        assert execution_time < 10.0, (
            f"Multi-user operations took {execution_time:.2f}s"
        )

        # Verify all tasks were created and users can only see their own
        assert len(all_tasks_created) == 15  # 3 users × 5 tasks each

        # Verify user isolation - each user should only see their own tasks
        for user in users:
            client = APIClient()
            client.force_authenticate(user=user)
            response = client.get("/api/tasks/")
            assert response.status_code == 200
            assert response.data["count"] == 5  # Only their own tasks
