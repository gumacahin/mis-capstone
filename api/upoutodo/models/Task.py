import zoneinfo
from datetime import timedelta

from dateutil import rrule
from django.db import models
from django.utils import timezone
from taggit.managers import TaggableManager

from .project_section import ProjectSection
from .tag import TaggedItem


class Task(models.Model):
    section = models.ForeignKey(
        ProjectSection, on_delete=models.CASCADE, related_name="tasks"
    )

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    completion_date = models.DateTimeField(blank=True, null=True)

    # NEW: Single source of truth for timing (nullable for tasks without due dates)
    rrule = models.TextField(
        blank=True, null=True, help_text="RRULE string for recurring tasks"
    )

    # MODIFIED: Now cached value (computed from rrule)
    due_date = models.DateTimeField(
        blank=True, null=True, help_text="Next due date (cached from rrule)"
    )

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

    @property
    def project(self):
        return self.section.project

    def get_user_timezone(self, user=None):
        """Get user's timezone, fallback to default"""
        if user and hasattr(user, "profile") and hasattr(user.profile, "timezone"):
            return user.profile.timezone
        return "Asia/Manila"

    def get_next_occurrence(self, user=None):
        """Calculate next occurrence from rrule in user's timezone"""
        if not self.rrule:
            return None

        try:
            rule = rrule.rrulestr(self.rrule)
            user_tz = self.get_user_timezone(user)
            now = timezone.now().astimezone(zoneinfo.ZoneInfo(user_tz))

            # Get next occurrence within next year
            occurrences = list(rule.between(now, now + timedelta(days=365), inc=True))
            return occurrences[0] if occurrences else None
        except Exception:
            return None

    def update_due_date_cache(self, user=None):
        """Update the cached due_date from rrule in user's timezone"""
        self.due_date = self.get_next_occurrence(user)
        self.save(update_fields=["due_date"])

    def get_occurrences_in_range(self, start_date, end_date, user=None):
        """Get all occurrences within a date range in user's timezone"""
        if not self.rrule:
            return []

        try:
            rule = rrule.rrulestr(self.rrule)
            user_tz = self.get_user_timezone(user)

            # Convert dates to user's timezone
            start_tz = start_date.astimezone(zoneinfo.ZoneInfo(user_tz))
            end_tz = end_date.astimezone(zoneinfo.ZoneInfo(user_tz))

            return list(rule.between(start_tz, end_tz, inc=True))
        except Exception:
            return []

    @property
    def is_recurring(self):
        """Check if task is recurring (no COUNT=1 in RRULE)"""
        try:
            return "COUNT:1" not in self.rrule
        except Exception:
            return False

    @property
    def is_completed(self):
        return self.completion_date is not None

    @property
    def is_overdue(self):
        return (
            self.due_date and not self.is_completed and self.due_date < timezone.now()
        )

    def __str__(self):
        return self.title

    def mark_complete(self):
        """Mark task complete and update next occurrence if recurring"""
        self.completion_date = timezone.now()
        self.save()

        # If recurring, update to next occurrence
        if self.is_recurring:
            self.update_due_date_cache()

    def mark_incomplete(self):
        """Mark task incomplete and restore due_date if recurring"""
        self.completion_date = None
        self.save()

        # If recurring, restore due_date from rrule
        if self.is_recurring:
            self.update_due_date_cache()

    class Meta:
        ordering = ["order", "-due_date", "priority", "completion_date"]
