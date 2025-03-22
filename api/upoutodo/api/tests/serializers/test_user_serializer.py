import pytest
from django.contrib.auth import get_user_model

from upoutodo.api.serializers import UserSerializer

pytestmark = pytest.mark.skip(reason="Not sure if we need these tests")

User = get_user_model()


@pytest.fixture
def user_data():
    return {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword123",
    }


@pytest.fixture
def user():
    return User.objects.create_user(
        username="testuser", email="testuser@example.com", password="testpassword123"
    )


@pytest.fixture
def user_serializer(user):
    return UserSerializer(user)


@pytest.mark.django_db
def test_user_serializer_valid_data(user_data):
    serializer = UserSerializer(data=user_data)
    assert serializer.is_valid()
    assert serializer.validated_data["username"] == user_data["username"]
    assert serializer.validated_data["email"] == user_data["email"]


@pytest.mark.django_db
def test_user_serializer_invalid_data():
    invalid_data = {"username": "", "email": "not-an-email", "password": "short"}
    serializer = UserSerializer(data=invalid_data)
    assert not serializer.is_valid()
    assert "username" in serializer.errors
    assert "email" in serializer.errors
    assert "password" in serializer.errors


@pytest.mark.django_db
def test_user_serializer_create(user_data):
    serializer = UserSerializer(data=user_data)
    assert serializer.is_valid()
    user = serializer.save()
    assert user.username == user_data["username"]
    assert user.email == user_data["email"]
    assert user.check_password(user_data["password"])


@pytest.mark.django_db
def test_user_serializer_update(user):
    update_data = {"username": "updateduser", "email": "updateduser@example.com"}
    serializer = UserSerializer(user, data=update_data, partial=True)
    assert serializer.is_valid()
    updated_user = serializer.save()
    assert updated_user.username == update_data["username"]
    assert updated_user.email == update_data["email"]
