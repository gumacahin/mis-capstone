import pytest
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient

from upoutodo.api.tests.factories import UserFactory


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
def test_user_me(auth_client, user):
    url = reverse("user-me")
    response = auth_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == user.username
