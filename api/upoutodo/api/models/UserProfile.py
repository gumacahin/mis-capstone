from django.contrib.auth import get_user_model
from django.db import models

from upoutodo.api.models import Project

User = get_user_model()


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100, blank=True)
    is_student = models.BooleanField(default=False)
    is_faculty = models.BooleanField(default=False)

    @property
    def inbox(self):
        return Project.get_user_inbox(self.user)
