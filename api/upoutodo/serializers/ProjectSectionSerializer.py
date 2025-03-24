from rest_framework import serializers

from upoutodo.models import Project, ProjectSection


class ProjectSectionSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    class Meta:
        model = ProjectSection
        ordering = ["order"]
        fields = ["id", "project", "title", "order", "tasks", "is_default"]
        read_only_fields = ["tasks"]

    def get_tasks(self, obj):
        from upoutodo.serializers import (
            TaskSerializer,  # Local import to avoid circular import
        )

        tasks = obj.tasks.all()
        return TaskSerializer(tasks, many=True, read_only=True).data
