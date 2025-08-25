"""
Django test settings for E2E testing.
"""

import os
from datetime import timedelta

from .settings import (
    AUTH0,
    BASE_DIR,
    INSTALLED_APPS,
)

# Test mode flags
DEBUG = True
E2E_TEST_MODE = True

# Add testkit to installed apps
INSTALLED_APPS = list(INSTALLED_APPS) + ["testkit"]

# Test database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db_test.sqlite3",
    }
}

# Email backend for testing
EMAIL_BACKEND = "django.core.mail.backends.filebased.EmailBackend"
EMAIL_FILE_PATH = os.getenv(
    "EMAIL_FILE_PATH", str(BASE_DIR.parent / "tmp" / "test-emails")
)

# CORS settings for test mode
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# CSRF settings for test mode
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Disable third-party integrations in test mode
PUSH_NOTIFICATIONS_ENABLED = False

# JWT configuration for test mode
# Keep existing Auth0 RS256 validation, but also accept test HS256 tokens
JWT_AUTH = {
    "JWT_PAYLOAD_GET_USERNAME_HANDLER": (
        "upoutodo.utils.jwt_get_username_from_payload_handler"
    ),
    "JWT_DECODE_HANDLER": "upoutodo.utils.jwt_decode_token",
    "JWT_ALGORITHM": "RS256",  # Keep for Auth0 compatibility
    "JWT_AUDIENCE": AUTH0["AUTH0_AUDIENCE"],
    "JWT_ISSUER": AUTH0["AUTH0_DOMAIN"],
    "JWT_AUTH_HEADER_PREFIX": "Bearer",
    # Test mode JWT settings
    "JWT_TEST_ISSUER": os.getenv("JWT_TEST_ISSUER", "https://e2e-test.upoutodo.local"),
    "JWT_TEST_AUDIENCE": os.getenv("JWT_TEST_AUDIENCE", "upoutodo-e2e"),
    "JWT_TEST_SIGNING_KEY": os.getenv("JWT_TEST_SIGNING_KEY"),
    "JWT_EXPIRATION_DELTA": timedelta(minutes=2),  # Short TTL for testing
    "JWT_REFRESH_EXPIRATION_DELTA": timedelta(minutes=10),
}

# Override REST_FRAMEWORK to use test JWT settings
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 1000,
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_jwt.authentication.JSONWebTokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "JWT_AUTH": JWT_AUTH,
}
