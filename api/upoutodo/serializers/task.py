from django.utils import timezone
from rest_framework import serializers
from taggit.serializers import TaggitSerializer, TagListSerializerField

from upoutodo.models import ProjectSection, Task


class TaskSerializer(TaggitSerializer, serializers.ModelSerializer):
    section = serializers.PrimaryKeyRelatedField(queryset=ProjectSection.objects.all())
    project = serializers.PrimaryKeyRelatedField(
        source="section.project", read_only=True
    )
    above_task = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(), required=False, write_only=True
    )
    below_task = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(), required=False, write_only=True
    )

    labels = TagListSerializerField(required=False, source="tags")

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "priority",
            "labels",
            "completion_date",
            "order",
            "section",
            "project",
            "above_task",
            "below_task",
        ]

    def validate_due_date(self, value):
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Date cannot be in the past")
        return value

    def validate(self, data):
        above_task = data.pop("above_task", None)
        below_task = data.pop("below_task", None)

        if above_task and below_task:
            raise serializers.ValidationError(
                "You can only specify one of 'above_task' or 'below_task'."
            )

        self.context["relative_to_task"] = above_task or below_task
        if above_task:
            data["order"] = above_task.order
        elif below_task:
            data["order"] = below_task.order + 1

        return data
