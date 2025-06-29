from django.contrib.auth import get_user_model
from django.db import models

from upoutodo.models import Project

User = get_user_model()


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100, blank=True)
    is_student = models.BooleanField(default=False)
    is_faculty = models.BooleanField(default=False)
    is_onboarded = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    class Theme(models.TextChoices):
        SYSTEM = "system", "System"
        LIGHT = "light", "Light"
        DARK = "dark", "Dark"

    theme = models.CharField(choices=Theme.choices, default=Theme.SYSTEM, max_length=6)

    @property
    def inbox(self):
        return Project.get_user_inbox(self.user)

    def update_from_request(self, request):
        updated = False
        for key, value in request.data.items():
            if hasattr(self, key):
                setattr(self, key, value)
                updated = True
        if updated:
            self.save()
