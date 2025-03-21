from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "upoutodo"

    def ready(self):
        import upoutodo.api.signals  # noqa: F401
