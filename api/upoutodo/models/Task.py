from datetime import datetime
from typing import Optional

from django.db import models
from django.utils import timezone
from taggit.managers import TaggableManager

from ..recurrence import get_next_occurrence
from .project_section import ProjectSection
from .tag import TaggedItem


class Task(models.Model):
    section = models.ForeignKey(
        ProjectSection, on_delete=models.CASCADE, related_name="tasks"
    )

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    completion_date = models.DateTimeField(blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Priority(models.TextChoices):
        NONE = "NONE", "None"
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    priority = models.CharField(
        choices=Priority.choices, default=Priority.NONE, max_length=6
    )

    tags = TaggableManager(through=TaggedItem)

    # Recurrence fields
    is_recurring = models.BooleanField(default=False)
    recurrence = models.CharField(max_length=255, blank=True)
    rrule = models.TextField(blank=True)
    recurrence_anchor = models.DateTimeField(null=True, blank=True)
    recurrence_timezone = models.CharField(max_length=64, default="Asia/Manila")
    repeat_when_complete = models.BooleanField(default=True)

    class AnchorMode(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled date"
        COMPLETED = "COMPLETED", "Completed date"

    recurrence_anchor_mode = models.CharField(
        max_length=10,
        choices=AnchorMode.choices,
        default=AnchorMode.SCHEDULED,
    )

    parent_task = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="instances",
    )

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

    def mark_complete(self, completed_at: Optional[datetime] = None):
        """Mark the task as complete and advance to next occurrence if recurring."""
        if completed_at is None:
            completed_at = timezone.now()

        self.completion_date = completed_at
        self.updated_at = timezone.now()
        self.save()

        # Handle recurrence if this is a recurring task
        if self.is_recurring and self.repeat_when_complete and self.rrule:
            self._advance_to_next_occurrence(completed_at)

    def mark_incomplete(self):
        self.completion_date = None
        self.save()

    def _advance_to_next_occurrence(self, completed_at: datetime):
        """Advance the task to its next occurrence based on the recurrence rule and anchor mode."""
        if not self.rrule or not self.recurrence_anchor:
            return

        try:
            # Choose anchor based on mode
            if self.recurrence_anchor_mode == self.AnchorMode.SCHEDULED:
                anchor = self.due_date
            else:  # COMPLETED
                anchor = completed_at

            # Get the next occurrence from the anchor
            next_occurrence = get_next_occurrence(
                anchor, self.rrule, self.recurrence_timezone
            )

            if next_occurrence:
                # Preserve time-of-day if original due_date had a time component
                if self.due_date and (
                    self.due_date.hour != 0 or self.due_date.minute != 0
                ):
                    # Apply the original time to the next occurrence
                    next_occurrence = next_occurrence.replace(
                        hour=self.due_date.hour,
                        minute=self.due_date.minute,
                        second=0,
                        microsecond=0,
                    )

                # Update the task to the next occurrence
                self.due_date = next_occurrence
                self.completion_date = None  # Reset completion
                self.updated_at = timezone.now()
                self.save()
        except Exception as e:
            # Log error but don't fail the completion
            print(f"Error advancing recurring task {self.id}: {e}")

    @property
    def next_occurrence(self):
        """Get the next occurrence of this recurring task."""
        if not self.is_recurring or not self.rrule:
            return None

        try:
            return get_next_occurrence(
                self.recurrence_anchor or self.created_at,
                self.rrule,
                self.recurrence_timezone,
            )
        except Exception:
            return None

    @property
    def humanized_recurrence(self):
        """Get human-readable recurrence description."""
        if not self.is_recurring or not self.rrule:
            return ""

        from ..recurrence import humanize_recurrence

        return humanize_recurrence(self.rrule, self.recurrence_timezone)

    class Meta:
        ordering = ["order", "-due_date", "priority", "completion_date"]
