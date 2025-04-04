from django.db import models
from django.utils import timezone
from taggit.managers import TaggableManager

from .project_section import ProjectSection


class Task(models.Model):
    section = models.ForeignKey(
        ProjectSection, on_delete=models.CASCADE, related_name="tasks"
    )

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    completion_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    order = models.PositiveIntegerField(default=1)

    class Priority(models.TextChoices):
        NONE = "NONE", "None"
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    priority = models.CharField(
        choices=Priority.choices, default=Priority.NONE, max_length=6
    )

    tags = TaggableManager()

    @property
    def project(self):
        return self.section.project

    @property
    def is_completed(self):
        return self.completion_date is not None

    @property
    def is_overdue(self):
        return (
            self.due_date
            and not self.is_completed
            and self.due_date < timezone.now().date()
        )

    def __str__(self):
        return self.title

    def mark_complete(self):
        self.completion_date = timezone.now().date()
        self.save()

    def mark_incomplete(self):
        self.completion_date = None
        self.save()

    class Meta:
        ordering = ["order", "-due_date", "priority", "completion_date"]
