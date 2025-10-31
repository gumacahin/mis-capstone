from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.html import strip_tags
from taggit.managers import TaggableManager

# Import calculate_next_due_date to avoid circular import issues
from upoutodo.utils import calculate_next_due_date

from .project_section import ProjectSection
from .tag import TaggedItem


class Task(models.Model):
    class AnchorMode(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        COMPLETED = "COMPLETED", "Completed"

    class Priority(models.TextChoices):
        NONE = "NONE", "None"
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    section = models.ForeignKey(
        ProjectSection, on_delete=models.CASCADE, related_name="tasks"
    )

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    completion_date = models.DateTimeField(blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    rrule = models.TextField(blank=True, default="")
    dtstart = models.DateTimeField(blank=True, null=True)
    anchor_mode = models.CharField(
        choices=AnchorMode.choices,
        blank=True,
        default="",
        max_length=10,
    )

    priority = models.CharField(
        choices=Priority.choices, default=Priority.NONE, max_length=6
    )

    tags = TaggableManager(through=TaggedItem)

    @property
    def project(self):
        return self.section.project

    @property
    def is_completed(self):
        return self.completion_date is not None

    @property
    def is_overdue(self):
        if not self.due_date or self.is_completed:
            return False
        return self.due_date < timezone.now()

    def __str__(self):
        title = strip_tags(self.title)
        return title if title else "Untitled Task"

    def mark_complete(self):
        """Mark task complete and create next occurrence if recurring."""
        self.completion_date = timezone.now()

        # If this is a recurring task, create the next occurrence
        if self.rrule and self.rrule.strip() and self.dtstart:
            self._create_next_occurrence()

        self.save()

    def _create_next_occurrence(self):
        """Create the next occurrence of a recurring task."""
        try:
            # Calculate next due date based on anchor mode
            if self.anchor_mode == self.AnchorMode.COMPLETED:
                # Next occurrence from completion time
                reference_date = timezone.now()
            else:  # SCHEDULED or empty (default to scheduled behavior)
                # Next occurrence from original schedule
                reference_date = self.due_date or self.dtstart

            next_due = calculate_next_due_date(self.rrule, reference_date)

            if next_due:
                # Create new task for next occurrence
                next_task = Task.objects.create(
                    title=self.title,
                    description=self.description,
                    section=self.section,
                    due_date=next_due,
                    priority=self.priority,
                    rrule=self.rrule,
                    dtstart=self.dtstart,
                    anchor_mode=self.anchor_mode,
                )

                # Copy tags
                for tag in self.tags.all():
                    next_task.tags.add(tag)
        except Exception:
            # Silently handle errors in next occurrence creation
            # In production, this should use proper logging
            pass

    def mark_incomplete(self):
        self.completion_date = None
        self.save()

    def clean(self):
        errors = {}

        # RRule validation
        if self.rrule and not self.dtstart:
            errors["dtstart"] = "Start date required when recurrence rule is set"

        if self.anchor_mode and self.anchor_mode != "" and not self.rrule:
            errors["rrule"] = "Recurrence rule required when anchor mode is set"

        if errors:
            raise ValidationError(errors)

    class Meta:
        ordering = ["order", "-due_date", "priority", "completion_date"]
