from django.utils import timezone
from rest_framework import serializers

from upoutodo.api.models import ProjectSection, Task


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    section = serializers.PrimaryKeyRelatedField(
        queryset=ProjectSection.objects.all(), required=False
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "priority",
            "completion_date",
            "section",
        ]

    def validate_due_date(self, value):
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Date cannot be in the past")
        return value
