"""
Tests for user-related API endpoints.

These tests verify the user viewset functionality including the /me endpoint
and user options/preferences updates.
"""

import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.tests.factories import UserFactory

User = get_user_model()


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
def test_user_me_endpoint(auth_client, user):
    """Test the /api/users/me/ endpoint returns current user data."""
    url = "/api/users/me/"
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK

    # Check that response contains expected user fields
    data = response.data
    expected_fields = {
        "id",
        "name",
        "email",
        "is_faculty",
        "is_student",
        "is_onboarded",
        "projects",
        "theme",
        "email_digest_enabled",
    }
    assert set(data.keys()) == expected_fields

    # Check that the returned user is the authenticated user
    assert data["id"] == user.id
    assert data["email"] == user.email


@pytest.mark.django_db
def test_user_me_endpoint_unauthenticated(api_client):
    """Test that /me endpoint requires authentication."""
    url = "/api/users/me/"
    response = api_client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_user_me_endpoint_updates_last_login(auth_client, user):
    """Test that accessing /me endpoint updates last_login timestamp."""
    url = "/api/users/me/"

    # Store original last_login
    original_last_login = user.last_login

    # Make request
    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK

    # Refresh user from database
    user.refresh_from_db()

    # last_login should be updated (or set if it was None)
    if original_last_login is None:
        assert user.last_login is not None
    else:
        assert user.last_login >= original_last_login


@pytest.mark.django_db
def test_user_options_endpoint(auth_client, user):
    """Test the /api/users/options/ endpoint for updating user preferences."""
    url = "/api/users/options/"

    # Test that the endpoint exists and accepts PATCH requests
    response = auth_client.patch(url, {}, format="json")

    # Should return 204 No Content for successful update
    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_user_options_endpoint_does_not_allow_admin_escalation(auth_client, user):
    """Test that profile option updates cannot grant admin access."""
    url = "/api/users/options/"

    response = auth_client.patch(
        url, {"is_admin": True, "theme": "dark"}, format="json"
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT
    user.profile.refresh_from_db()
    assert user.profile.is_admin is False
    assert user.profile.theme == "dark"


@pytest.mark.django_db
def test_user_options_endpoint_unauthenticated(api_client):
    """Test that options endpoint requires authentication."""
    url = "/api/users/options/"
    response = api_client.patch(url, {}, format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_user_list_endpoint_authenticated(auth_client):
    """Test that authenticated users can access the user list."""
    url = "/api/users/"
    response = auth_client.get(url)

    # Should be successful (users can see user list)
    assert response.status_code == status.HTTP_200_OK
    assert "results" in response.data


@pytest.mark.django_db
def test_user_list_endpoint_unauthenticated(api_client):
    """Test that user list requires authentication."""
    url = "/api/users/"
    response = api_client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_user_detail_endpoint(auth_client, user):
    """Test retrieving a specific user's details."""
    url = f"/api/users/{user.id}/"
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK

    # Should return user data
    data = response.data
    assert data["id"] == user.id
    assert data["email"] == user.email


@pytest.mark.django_db
def test_user_viewset_permissions(auth_client):
    """Test that user viewset requires authentication for all operations."""
    # Create another user to test with
    other_user = UserFactory()

    # Test various endpoints require authentication
    endpoints_and_methods = [
        ("/api/users/", "GET"),
        (f"/api/users/{other_user.id}/", "GET"),
        ("/api/users/me/", "GET"),
        ("/api/users/options/", "PATCH"),
    ]

    for url, method in endpoints_and_methods:
        # Test with authentication (should work)
        if method == "GET":
            response = auth_client.get(url)
        elif method == "PATCH":
            response = auth_client.patch(url, {}, format="json")

        # Should not be unauthorized (might be 200, 204, or other success codes)
        assert (
            response.status_code != status.HTTP_401_UNAUTHORIZED
        ), f"{method} {url} should work when authenticated"
