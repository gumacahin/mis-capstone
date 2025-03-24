from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class ProjectViewMode(models.TextChoices):
    LIST = "list", "List View"
    BOARD = "board", "Board View"


class Project(models.Model):
    DEFAULT_PROJECT_SECTION_TITLE = "(No Section)"

    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_projects"
    )
    updated_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="updated_projects"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=100)

    is_default = models.BooleanField(default=False)

    view = models.CharField(
        max_length=5, choices=ProjectViewMode.choices, default=ProjectViewMode.LIST
    )
    order = models.PositiveIntegerField(default=0)

    @classmethod
    def get_user_inbox(cls, user):
        return cls.objects.get(created_by=user, is_default=True)

    @property
    def default_section(self):
        return self.sections.get(is_default=True)

    def __str__(self):
        return f'"{self.title}" created by {self.created_by}'

    class Meta:
        ordering = ["order", "-created_at"]
