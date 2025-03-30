from django.db import models
from django.utils import timezone
from taggit.managers import TaggableManager

from .project_section import ProjectSection


class Task(models.Model):
    section = models.ForeignKey(
        ProjectSection, on_delete=models.CASCADE, related_name="tasks", null=True
    )

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    completion_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)

    class Priority(models.IntegerChoices):
        NONE = 0, "None"
        LOW = 1, "Low"
        MEDIUM = 2, "Medium"
        HIGH = 3, "High"

    priority = models.IntegerField(choices=Priority.choices, default=Priority.NONE)

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
        ordering = ["due_date", "priority", "completion_date"]
