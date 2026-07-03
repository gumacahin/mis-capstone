from django.conf import settings


def test_security_defaults_do_not_enable_debug_or_public_cors():
    assert settings.DEBUG is False
    assert settings.CORS_ORIGIN_ALLOW_ALL is False


def test_cors_middleware_runs_before_common_middleware():
    assert settings.MIDDLEWARE.index(
        "corsheaders.middleware.CorsMiddleware"
    ) < settings.MIDDLEWARE.index("django.middleware.common.CommonMiddleware")
