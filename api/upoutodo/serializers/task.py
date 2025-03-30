from django.utils import timezone
from rest_framework import serializers

from upoutodo.models import ProjectSection, Task

from taggit.serializers import TagListSerializerField, TaggitSerializer


class TaskSerializer(TaggitSerializer, serializers.ModelSerializer):
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=ProjectSection.objects.all(), source="section"
    )

    tags = TagListSerializerField(required=False)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "priority",
            "tags",
            "completion_date",
            "section_id",
        ]

    def validate_due_date(self, value):
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Date cannot be in the past")
        return value
