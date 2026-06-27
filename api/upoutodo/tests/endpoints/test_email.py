import pytest
from django.test import override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.tests.factories import (
    ProjectFactory,
    ProjectSectionFactory,
    TaskFactory,
    UserFactory,
)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.mark.django_db
def test_daily_digest_endpoint_rejects_public_requests(api_client):
    """Test that the daily digest endpoint is not publicly callable."""
    url = reverse("daily-digest")
    response = api_client.post(url, format="json")
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_daily_digest_endpoint_allows_admin(auth_client, user):
    """Test that admins can trigger the daily digest endpoint."""
    user.profile.is_admin = True
    user.profile.save(update_fields=["is_admin"])

    url = reverse("daily-digest")
    response = auth_client.post(url, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data is None


@pytest.mark.django_db
@override_settings(DAILY_DIGEST_SCHEDULER_SECRET="test-secret")
def test_daily_digest_endpoint_allows_scheduler_secret(api_client):
    """Test that the scheduler secret can trigger the daily digest endpoint."""
    url = reverse("daily-digest")
    response = api_client.post(
        url, format="json", HTTP_X_SCHEDULER_SECRET="test-secret"
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data is None


@pytest.mark.django_db
def test_daily_digest_endpoint_url_is_correct():
    """Test that the daily digest endpoint URL is correct"""
    url = reverse("daily-digest")
    assert url == "/api/email/daily-digest"


@pytest.mark.django_db
@override_settings(DAILY_DIGEST_SCHEDULER_SECRET="test-secret")
def test_daily_digest_with_user_and_tasks():
    """Test daily digest with a user that has tasks"""
    # Create a user with tasks
    user = UserFactory(email="test@example.com")
    project = ProjectFactory(created_by=user, title="Test Project")
    section = ProjectSectionFactory(project=project, title="Test Section")

    # Create tasks for today
    today = timezone.now().date()
    yesterday = today - timezone.timedelta(days=1)

    # Create tasks for today with timezone-aware dates
    today_datetime = timezone.make_aware(
        timezone.datetime.combine(today, timezone.datetime.min.time())
    )
    yesterday_datetime = timezone.make_aware(
        timezone.datetime.combine(yesterday, timezone.datetime.min.time())
    )

    TaskFactory(
        section=section, title="Task 1", due_date=today_datetime, completion_date=None
    )
    TaskFactory(
        section=section, title="Task 2", due_date=today_datetime, completion_date=None
    )

    # Create an overdue task
    TaskFactory(
        section=section,
        title="Overdue Task",
        due_date=yesterday_datetime,
        completion_date=None,
    )

    # Test the endpoint
    api_client = APIClient()
    url = reverse("daily-digest")
    response = api_client.post(
        url, format="json", HTTP_X_SCHEDULER_SECRET="test-secret"
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data is None
