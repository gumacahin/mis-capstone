from django.apps import AppConfig


class UpoutodoConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "upoutodo"

    def ready(self):
        from . import signals
