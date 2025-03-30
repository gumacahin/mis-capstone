from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")

    class Theme(models.TextChoices):
        LIGHT = "light", "Light"
        DARK = "dark", "Dark"
        SYSTEM = "system", "System"

    theme = models.CharField(max_length=10, choices=Theme.choices, default=Theme.SYSTEM)
