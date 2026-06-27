from datetime import timedelta

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from upoutodo.models import EnergyCheckIn, PlanItem, Project, TodayPlan
from upoutodo.services.planner import (
    normalized_priority,
    priority_label,
    task_due_date,
)

from .task import TaskSerializer


class EnergyCheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyCheckIn
        fields = [
            "id",
            "date",
            "energy_level",
            "available_minutes",
            "focus_mode",
            "context",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "date", "created_at", "updated_at"]

    def validate_available_minutes(self, value):
        if value < 0 or value > 720:
            raise serializers.ValidationError(
                "Available minutes must be between 0 and 720."
            )
        return value


class PlanItemSignalsSerializer(serializers.Serializer):
    due_date = serializers.DateField(allow_null=True)
    due_status = serializers.ChoiceField(
        choices=["none", "overdue", "due_today", "due_soon", "later"]
    )
    due_label = serializers.CharField()
    due_in_days = serializers.IntegerField(allow_null=True)
    priority = serializers.CharField()
    priority_label = serializers.CharField()
    estimated_minutes = serializers.IntegerField()
    is_recurring = serializers.BooleanField()
    project_title = serializers.CharField()
    section_title = serializers.CharField(allow_null=True)
    score = serializers.IntegerField()
    snoozed_count = serializers.IntegerField()
    dismissed_count = serializers.IntegerField()


class PlanItemSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    signals = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PlanItem
        fields = [
            "id",
            "task",
            "order",
            "reason",
            "estimated_minutes",
            "score",
            "signals",
            "status",
            "snoozed_until",
            "accepted_at",
            "dismissed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    @extend_schema_field(PlanItemSignalsSerializer)
    def get_signals(self, obj):
        due_date = task_due_date(obj.task)
        due_status = get_due_status(due_date, obj.plan.date)
        priority = normalized_priority(obj.task)
        section_title = obj.task.section.title
        if section_title == Project.DEFAULT_PROJECT_SECTION_TITLE:
            section_title = None

        return {
            "due_date": due_date.isoformat() if due_date else None,
            "due_status": due_status,
            "due_label": get_due_label(due_status, due_date),
            "due_in_days": get_due_in_days(due_date, obj.plan.date),
            "priority": priority,
            "priority_label": priority_label(priority),
            "estimated_minutes": obj.estimated_minutes,
            "is_recurring": bool(obj.task.rrule),
            "project_title": obj.task.section.project.title,
            "section_title": section_title,
            "score": round(obj.score),
            "snoozed_count": PlanItem.objects.filter(
                plan__user=obj.plan.user,
                task=obj.task,
                status=PlanItem.Status.SNOOZED,
            ).count(),
            "dismissed_count": PlanItem.objects.filter(
                plan__user=obj.plan.user,
                task=obj.task,
                status=PlanItem.Status.DISMISSED,
            ).count(),
        }


class TodayPlanSerializer(serializers.ModelSerializer):
    check_in = EnergyCheckInSerializer(read_only=True)
    suggestions = PlanItemSerializer(source="items", many=True, read_only=True)

    class Meta:
        model = TodayPlan
        fields = [
            "id",
            "date",
            "status",
            "generated_at",
            "check_in",
            "suggestions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class SnoozePlanItemSerializer(serializers.Serializer):
    minutes = serializers.IntegerField(default=60, min_value=1, max_value=10080)


def get_due_status(due_date, plan_date):
    if due_date is None:
        return "none"
    if due_date < plan_date:
        return "overdue"
    if due_date == plan_date:
        return "due_today"
    if due_date <= plan_date + timedelta(days=7):
        return "due_soon"
    return "later"


def get_due_label(due_status, due_date):
    if due_status == "none":
        return "No due date"
    if due_status == "overdue":
        return f"Overdue {due_date.isoformat()}"
    if due_status == "due_today":
        return "Due today"
    return f"Due {due_date.isoformat()}"


def get_due_in_days(due_date, plan_date):
    if due_date is None:
        return None
    return (due_date - plan_date).days
