import os

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed


class E2EBearerTokenAuthentication(BaseAuthentication):
    """Authenticate Playwright E2E requests against a seeded local user.

    This is intentionally disabled unless explicit E2E flags are present and the
    app is running in debug or test mode.
    """

    keyword = "Bearer"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()
        if len(auth) != 2 or auth[0].lower() != self.keyword.lower().encode():
            return None

        token = auth[1].decode("utf-8")
        expected_token = os.getenv("E2E_BEARER_TOKEN", "e2e-token")
        if token != expected_token:
            return None

        if not e2e_auth_enabled():
            raise AuthenticationFailed("E2E authentication is disabled.")

        user_identifier = (
            os.getenv("E2E_USER_EMAIL")
            or os.getenv("AUTH0_USERNAME")
            or "planner-demo@example.test"
        )
        user = find_e2e_user(user_identifier)
        if user is None:
            raise AuthenticationFailed(
                f"E2E user '{user_identifier}' does not exist. Seed demo data first."
            )

        return (user, None)

    def authenticate_header(self, request):
        return self.keyword


def e2e_auth_enabled():
    safe_runtime = getattr(settings, "DEBUG", False) or getattr(
        settings, "IS_TESTING", False
    )
    return (
        safe_runtime
        and os.getenv("E2E_TEST_MODE", "0") == "1"
        and os.getenv("DJANGO_ALLOW_TEST_ENDPOINTS", "0") == "1"
    )


def find_e2e_user(identifier):
    User = get_user_model()
    return (
        User.objects.filter(email=identifier).first()
        or User.objects.filter(username=identifier).first()
    )
