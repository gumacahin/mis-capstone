# upoutodo/views/test_auth.py

import os
from datetime import datetime, timedelta

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from upoutodo.models import UserProfile

User = get_user_model()

# Environment guard - use your existing E2E infrastructure from .envrc
E2E_TEST_MODE = os.getenv("E2E_TEST_MODE", "0") == "1"
DJANGO_ALLOW_TEST_ENDPOINTS = os.getenv("DJANGO_ALLOW_TEST_ENDPOINTS", "0") == "1"
DEBUG = getattr(settings, "DEBUG", False)

# Use your existing environment variable structure
ENDPOINT_ENABLED = (E2E_TEST_MODE and DJANGO_ALLOW_TEST_ENDPOINTS) or DEBUG

# Use your existing test JWT configuration
JWT_TEST_ISSUER = os.getenv("JWT_TEST_ISSUER", "https://e2e-test.upoutodo.local")
JWT_TEST_AUDIENCE = os.getenv("JWT_TEST_AUDIENCE", "upoutodo-e2e")
JWT_TEST_SIGNING_KEY = os.getenv(
    "JWT_TEST_SIGNING_KEY",
    "2be3e194f4c86cb09dfdbec5d9358ab7026c7729a59759048ef340a157d43445",
)


@api_view(["POST"])
@permission_classes([AllowAny])
def test_login(request):
    """
    Test-only endpoint for programmatic authentication in e2e tests.

    This integrates with your existing E2E infrastructure from .envrc:
    - Uses E2E_TEST_MODE and DJANGO_ALLOW_TEST_ENDPOINTS flags
    - Uses JWT_TEST_* configuration for test tokens
    - Activated by .e2e sentinel file

    SECURITY: This endpoint is ONLY available when:
    - E2E_TEST_MODE=1 AND DJANGO_ALLOW_TEST_ENDPOINTS=1
    - OR DEBUG=True (development only)
    """

    if not ENDPOINT_ENABLED:
        return Response(
            {"error": "Test auth endpoint not available"},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        # Get user data from request
        email = request.data.get("email", "e2e-test@upou.edu.ph")
        nickname = request.data.get("nickname", "e2etest")
        name = request.data.get("name", "E2E Test User")
        role = request.data.get("role", "user")  # 'user' or 'admin'

        # Create or get the test user
        username = email.replace("@", ".").replace("|", ".")
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "first_name": name.split()[0] if name else "E2E",
                "last_name": " ".join(name.split()[1:])
                if len(name.split()) > 1
                else "User",
                "is_active": True,
            },
        )

        # Ensure user profile exists and set role
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                "name": name,
                "is_onboarded": True,
                "is_admin": role == "admin",
                "is_student": role == "user",
            },
        )

        # Update profile if it already exists
        if role == "admin":
            profile.is_admin = True
            profile.is_student = False
        else:
            profile.is_admin = False
            profile.is_student = True

        # Ensure test users are always onboarded
        profile.is_onboarded = True
        profile.save()

        # Create a test JWT token using your existing test configuration
        now = datetime.utcnow()
        payload = {
            "sub": f"auth0|{user.username}",
            "email": email,
            "name": name,
            "nickname": nickname,
            "email_verified": True,
            "iss": JWT_TEST_ISSUER,
            "aud": JWT_TEST_AUDIENCE,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(hours=24)).timestamp()),
            "scope": "openid profile email",
        }

        # Use your test signing key for the JWT
        test_token = jwt.encode(payload, JWT_TEST_SIGNING_KEY, algorithm="HS256")

        # Return the authentication data that the frontend expects
        response_data = {
            "success": True,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": name,
                "nickname": nickname,
                "profile": {
                    "is_admin": profile.is_admin,
                    "is_student": profile.is_student,
                    "is_faculty": profile.is_faculty,
                    "is_onboarded": profile.is_onboarded,
                    "theme": profile.theme,
                },
            },
            "auth_state": {
                "access_token": test_token,
                "id_token": test_token,
                "scope": "openid profile email",
                "expires_in": 86400,
                "token_type": "Bearer",
            },
            "storage_keys": {
                "auth_key": f"@@auth0spajs@@::{settings.AUTH0['AUTH0_CLIENT_ID']}::{{origin}}::openid profile email",
                "user_key": f"@@auth0spajs@@::{settings.AUTH0['AUTH0_CLIENT_ID']}::{{origin}}::@@user@@",
            },
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Test login failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def test_setup_data(request):
    """
    Test-only endpoint to set up test data (projects, tasks, etc.)
    """

    if not ENDPOINT_ENABLED:
        return Response(
            {"error": "Test data endpoint not available"},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        # Get the test user
        email = request.data.get("email", "e2e-test@upou.edu.ph")
        username = email.replace("@", ".").replace("|", ".")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": "Test user not found. Call test_login first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # The user should already have an inbox project from signals
        # We can add more test data here if needed

        return Response(
            {
                "success": True,
                "message": "Test data setup complete",
                "user_id": user.id,
                "projects_count": user.projects.count(),
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"error": f"Test data setup failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
