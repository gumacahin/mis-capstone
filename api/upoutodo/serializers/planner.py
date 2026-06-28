from datetime import timedelta

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from upoutodo.models import (
    EnergyCheckIn,
    PlanItem,
    Project,
    TodayPlan,
    TodayPlanFeedback,
)
from upoutodo.services.planner import (
    PLANNER_ALLOWED_SUGGESTION_ACTIONS,
    build_plan_ui_schema,
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


class TodayPlanFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodayPlanFeedback
        fields = [
            "id",
            "helpfulness_rating",
            "confidence_rating",
            "note",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_helpfulness_rating(self, value):
        return validate_rating(value)

    def validate_confidence_rating(self, value):
        return validate_rating(value)

    def validate_note(self, value):
        if len(value) > 1000:
            raise serializers.ValidationError("Note must be 1000 characters or less.")
        return value


class PlannerUiSchemaSerializer(serializers.Serializer):
    component = serializers.ChoiceField(
        choices=[
            "LowEnergyPlanCard",
            "TaskTriagePanel",
            "TimeBoxPlanCard",
            "TodayPlanCard",
        ]
    )
    mode = serializers.ChoiceField(
        choices=["default", "limited_time", "low_energy", "overdue_triage"]
    )
    title = serializers.CharField()
    message = serializers.CharField(allow_blank=True)
    highlights = serializers.ListField(child=serializers.CharField())
    suggestion_ids = serializers.ListField(child=serializers.IntegerField())
    allowed_actions = serializers.ListField(
        child=serializers.ChoiceField(choices=PLANNER_ALLOWED_SUGGESTION_ACTIONS)
    )


class TodayPlanSerializer(serializers.ModelSerializer):
    check_in = EnergyCheckInSerializer(read_only=True)
    suggestions = PlanItemSerializer(source="items", many=True, read_only=True)
    feedback = serializers.SerializerMethodField(read_only=True)
    ui_schema = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TodayPlan
        fields = [
            "id",
            "date",
            "status",
            "generated_at",
            "check_in",
            "suggestions",
            "feedback",
            "ui_schema",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    @extend_schema_field(TodayPlanFeedbackSerializer(allow_null=True))
    def get_feedback(self, obj):
        try:
            feedback = obj.feedback
        except TodayPlanFeedback.DoesNotExist:
            return None
        return TodayPlanFeedbackSerializer(feedback).data

    @extend_schema_field(PlannerUiSchemaSerializer)
    def get_ui_schema(self, obj):
        return PlannerUiSchemaSerializer(build_plan_ui_schema(obj)).data


class PlannerSuggestionStatusCountsSerializer(serializers.Serializer):
    suggested = serializers.IntegerField()
    accepted = serializers.IntegerField()
    snoozed = serializers.IntegerField()
    dismissed = serializers.IntegerField()
    done = serializers.IntegerField()


class PlannerSuggestionActionRatesSerializer(serializers.Serializer):
    accepted = serializers.FloatField()
    snoozed = serializers.FloatField()
    dismissed = serializers.FloatField()


class PlannerEvaluationSummarySerializer(serializers.Serializer):
    plan_count = serializers.IntegerField()
    feedback_count = serializers.IntegerField()
    feedback_response_rate = serializers.FloatField()
    average_helpfulness_rating = serializers.FloatField(allow_null=True)
    average_confidence_rating = serializers.FloatField(allow_null=True)
    total_suggestions = serializers.IntegerField()
    suggestion_status_counts = PlannerSuggestionStatusCountsSerializer()
    suggestion_action_rates = PlannerSuggestionActionRatesSerializer()


class SnoozePlanItemSerializer(serializers.Serializer):
    minutes = serializers.IntegerField(default=60, min_value=1, max_value=10080)


def validate_rating(value):
    if value < 1 or value > 5:
        raise serializers.ValidationError("Rating must be between 1 and 5.")
    return value


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
