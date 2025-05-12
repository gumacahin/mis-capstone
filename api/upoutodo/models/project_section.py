from django.db import models

from .project import Project


class ProjectSection(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="sections"
    )
    title = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
