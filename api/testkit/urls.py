"""
URL patterns for testkit app (E2E testing endpoints).
"""

from django.urls import path

from . import views

app_name = "testkit"

urlpatterns = [
    path("health", views.health_check, name="health"),
    path("login", views.test_login, name="login"),
    path("warmup", views.test_warmup, name="warmup"),
    path("reset", views.test_reset, name="reset"),
    path("seed", views.test_seed, name="seed"),
    path("email-dump", views.email_dump, name="email-dump"),
    path("email-clear", views.email_clear, name="email-clear"),
]
