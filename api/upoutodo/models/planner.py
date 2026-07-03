from django.contrib.auth import get_user_model
from django.db import models

from .task import Task

User = get_user_model()


class EnergyCheckIn(models.Model):
    class EnergyLevel(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"

    class FocusMode(models.TextChoices):
        FLEXIBLE = "flexible", "Flexible"
        DEEP = "deep", "Deep Work"
        ADMIN = "admin", "Admin"
        LIGHT = "light", "Light Work"

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="energy_check_ins"
    )
    date = models.DateField()
    energy_level = models.CharField(
        choices=EnergyLevel.choices, default=EnergyLevel.MEDIUM, max_length=10
    )
    available_minutes = models.PositiveIntegerField(default=120)
    focus_mode = models.CharField(
        choices=FocusMode.choices, default=FocusMode.FLEXIBLE, max_length=10
    )
    context = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-updated_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"], name="unique_energy_check_in_per_user_date"
            )
        ]


class TodayPlan(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        ARCHIVED = "archived", "Archived"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="today_plans")
    date = models.DateField()
    status = models.CharField(
        choices=Status.choices, default=Status.ACTIVE, max_length=10
    )
    check_in = models.ForeignKey(
        EnergyCheckIn,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="today_plans",
    )
    generated_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-generated_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"], name="unique_today_plan_per_user_date"
            )
        ]


class TodayPlanFeedback(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="today_plan_feedback"
    )
    plan = models.OneToOneField(
        TodayPlan, on_delete=models.CASCADE, related_name="feedback"
    )
    helpfulness_rating = models.PositiveSmallIntegerField()
    confidence_rating = models.PositiveSmallIntegerField()
    note = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(
                    helpfulness_rating__gte=1, helpfulness_rating__lte=5
                ),
                name="today_plan_feedback_helpfulness_between_1_and_5",
            ),
            models.CheckConstraint(
                condition=models.Q(confidence_rating__gte=1, confidence_rating__lte=5),
                name="today_plan_feedback_confidence_between_1_and_5",
            ),
        ]


class PlanItem(models.Model):
    class Status(models.TextChoices):
        SUGGESTED = "suggested", "Suggested"
        ACCEPTED = "accepted", "Accepted"
        SNOOZED = "snoozed", "Snoozed"
        DISMISSED = "dismissed", "Dismissed"
        DONE = "done", "Done"

    plan = models.ForeignKey(TodayPlan, on_delete=models.CASCADE, related_name="items")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="plan_items")
    order = models.PositiveIntegerField(default=1)
    reason = models.TextField(blank=True, default="")
    estimated_minutes = models.PositiveIntegerField(default=30)
    score = models.FloatField(default=0)
    status = models.CharField(
        choices=Status.choices, default=Status.SUGGESTED, max_length=10
    )
    snoozed_until = models.DateTimeField(blank=True, null=True)
    accepted_at = models.DateTimeField(blank=True, null=True)
    dismissed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-score", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["plan", "task"], name="unique_plan_item_per_plan_task"
            )
        ]
