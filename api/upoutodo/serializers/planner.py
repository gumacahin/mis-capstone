from rest_framework import serializers

from upoutodo.models import EnergyCheckIn, PlanItem, TodayPlan

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


class PlanItemSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)

    class Meta:
        model = PlanItem
        fields = [
            "id",
            "task",
            "order",
            "reason",
            "estimated_minutes",
            "score",
            "status",
            "snoozed_until",
            "accepted_at",
            "dismissed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


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
