"""
Views for testkit app (E2E testing endpoints).
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


def _check_guards():
    """Check if test endpoints should be enabled."""
    return (
        getattr(settings, "DEBUG", False)
        and getattr(settings, "E2E_TEST_MODE", False)
        and os.getenv("DJANGO_ALLOW_TEST_ENDPOINTS") == "1"
    )


def _mint_test_jwt(email, roles=None):
    """Mint a test JWT token for E2E testing."""
    if not _check_guards():
        return None

    now = datetime.utcnow()
    payload = {
        "iss": settings.JWT_AUTH["JWT_TEST_ISSUER"],
        "aud": settings.JWT_AUTH["JWT_TEST_AUDIENCE"],
        "sub": f"auth0|{email.replace('@', '_at_').replace('.', '_')}",
        "email": email,
        "iat": now,
        "exp": now + timedelta(minutes=2),  # 2 minute expiration
    }

    if roles:
        payload["roles"] = roles

    token = jwt.encode(
        payload, settings.JWT_AUTH["JWT_TEST_SIGNING_KEY"], algorithm="HS256"
    )

    return token


@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint to verify test mode configuration."""
    if not _check_guards():
        return JsonResponse({"error": "Not found"}, status=404)

    return JsonResponse(
        {
            "debug": getattr(settings, "DEBUG", False),
            "e2e_test_mode": getattr(settings, "E2E_TEST_MODE", False),
            "allow_test_endpoints": os.getenv("DJANGO_ALLOW_TEST_ENDPOINTS") == "1",
            "timestamp": datetime.utcnow().isoformat(),
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def test_login(request):
    """Mint a test JWT token for E2E testing."""
    if not _check_guards():
        return JsonResponse({"error": "Not found"}, status=404)

    try:
        data = json.loads(request.body)
        email = data.get("email", "e2e.user@example.com")
        roles = data.get("roles", ["user"])

        token = _mint_test_jwt(email, roles)
        if not token:
            return JsonResponse({"error": "Failed to mint token"}, status=500)

        return JsonResponse(
            {
                "access": token,
                "refresh": None,  # No refresh token for test mode
                "claims": {
                    "iss": settings.JWT_AUTH["JWT_TEST_ISSUER"],
                    "aud": settings.JWT_AUTH["JWT_TEST_AUDIENCE"],
                    "sub": f"auth0|{email.replace('@', '_at_').replace('.', '_')}",
                    "email": email,
                    "roles": roles,
                },
            }
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def test_warmup(request):
    """No-op endpoint that requires authentication to trigger user creation."""
    if not _check_guards():
        return JsonResponse({"error": "Not found"}, status=404)

    # This endpoint's purpose is to trigger the normal auth flow:
    # JWT → RemoteUserBackend → post_save signals → User + UserProfile + Inbox
    return JsonResponse({"ok": True, "user_id": request.user.id})


@csrf_exempt
@require_http_methods(["POST"])
def test_reset(request):
    """Reset the test database to a clean state."""
    if not _check_guards():
        return JsonResponse({"error": "Not found"}, status=404)

    try:
        data = json.loads(request.body) if request.body else {}
        scenario = data.get("scenario", "baseline_empty_user")

        # Truncate all domain tables
        with connection.cursor() as cursor:
            # Get all table names
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'django_%'
            """)
            tables = [row[0] for row in cursor.fetchall()]

            # Disable foreign key constraints
            cursor.execute("PRAGMA foreign_keys=OFF")

            # Truncate each table
            for table in tables:
                cursor.execute(f"DELETE FROM {table}")
                cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table}'")

            # Re-enable foreign key constraints
            cursor.execute("PRAGMA foreign_keys=ON")

        # Clear email outbox
        email_path = Path(settings.EMAIL_FILE_PATH)
        if email_path.exists():
            for email_file in email_path.glob("*.log"):
                email_file.unlink()

        return JsonResponse(
            {
                "ok": True,
                "scenario": scenario,
                "tables_truncated": len(tables),
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def test_seed(request):
    """Seed the database with test data."""
    if not _check_guards():
        return JsonResponse({"error": "Not found"}, status=404)

    try:
        data = json.loads(request.body) if request.body else {}
        scenario = data.get("scenario", "baseline_empty_user")

        created_ids = {}

        if scenario == "today_with_overdue":
            # Create a user with some tasks
            user = User.objects.create_user(
                username="e2e_test_user",
                email="e2e.test@example.com",
                password="testpass123",
            )

            # Create some test data (tasks, projects, etc.)
            # This would be expanded based on your specific needs
            created_ids["user_id"] = user.id

        elif scenario == "inbox_with_unorganized":
            # Create a user with unorganized tasks
            user = User.objects.create_user(
                username="e2e_inbox_user",
                email="e2e.inbox@example.com",
                password="testpass123",
            )
            created_ids["user_id"] = user.id

        else:
            # baseline_empty_user - no additional data needed
            pass

        return JsonResponse(
            {
                "ok": True,
                "scenario": scenario,
                "created_ids": created_ids,
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def email_dump(request):
    """Read all emails from the test email outbox."""
    if not _check_guards():
        return JsonResponse({"error": "Not found"}, status=404)

    try:
        email_path = Path(settings.EMAIL_FILE_PATH)
        emails = []

        if email_path.exists():
            for email_file in email_path.glob("*.log"):
                with open(email_file, "r") as f:
                    emails.append(
                        {
                            "file": email_file.name,
                            "content": f.read(),
                        }
                    )

        return JsonResponse(
            {
                "ok": True,
                "emails": emails,
                "count": len(emails),
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def email_clear(request):
    """Clear all emails from the test email outbox."""
    if not _check_guards():
        return JsonResponse({"error": "Not found"}, status=404)

    try:
        email_path = Path(settings.EMAIL_FILE_PATH)
        cleared_count = 0

        if email_path.exists():
            for email_file in email_path.glob("*.log"):
                email_file.unlink()
                cleared_count += 1

        return JsonResponse(
            {
                "ok": True,
                "cleared_count": cleared_count,
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
