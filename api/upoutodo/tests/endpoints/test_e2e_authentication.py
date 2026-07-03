import pytest
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.tests.factories import UserFactory


@pytest.mark.django_db
def test_e2e_bearer_token_authenticates_seeded_user(monkeypatch):
    user = UserFactory(username="planner-demo", email="planner-demo@example.test")
    monkeypatch.setenv("E2E_TEST_MODE", "1")
    monkeypatch.setenv("DJANGO_ALLOW_TEST_ENDPOINTS", "1")
    monkeypatch.setenv("E2E_USER_EMAIL", user.email)
    monkeypatch.setenv("E2E_BEARER_TOKEN", "e2e-token")

    client = APIClient()
    response = client.get(
        "/api/users/me/",
        HTTP_AUTHORIZATION="Bearer e2e-token",
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["email"] == user.email


@pytest.mark.django_db
def test_e2e_bearer_token_is_disabled_without_e2e_flags(monkeypatch):
    UserFactory(username="planner-demo", email="planner-demo@example.test")
    monkeypatch.delenv("E2E_TEST_MODE", raising=False)
    monkeypatch.delenv("DJANGO_ALLOW_TEST_ENDPOINTS", raising=False)
    monkeypatch.setenv("E2E_USER_EMAIL", "planner-demo@example.test")
    monkeypatch.setenv("E2E_BEARER_TOKEN", "e2e-token")

    client = APIClient()
    response = client.get(
        "/api/users/me/",
        HTTP_AUTHORIZATION="Bearer e2e-token",
        format="json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_e2e_bearer_token_rejects_missing_seeded_user(monkeypatch):
    monkeypatch.setenv("E2E_TEST_MODE", "1")
    monkeypatch.setenv("DJANGO_ALLOW_TEST_ENDPOINTS", "1")
    monkeypatch.setenv("E2E_USER_EMAIL", "missing@example.test")
    monkeypatch.setenv("E2E_BEARER_TOKEN", "e2e-token")

    client = APIClient()
    response = client.get(
        "/api/users/me/",
        HTTP_AUTHORIZATION="Bearer e2e-token",
        format="json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
