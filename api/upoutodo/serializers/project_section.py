from rest_framework import serializers

from upoutodo.models import Project, ProjectSection


class ProjectSectionSerializer(serializers.HyperlinkedModelSerializer):
    tasks = serializers.SerializerMethodField(read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    preceding_section = serializers.PrimaryKeyRelatedField(
        queryset=ProjectSection.objects.all(), required=True, write_only=True
    )
    source_project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = ProjectSection
        fields = [
            "id",
            "project",
            "title",
            "order",
            "tasks",
            "is_default",
            "preceding_section",
            "source_project",
        ]

    def validate(self, data):
        preceding_section = data.pop("preceding_section", None)
        data["order"] = (
            preceding_section.order + 1 if preceding_section else self.instance.order
        )
        return data

    def get_tasks(self, obj):
        from upoutodo.serializers import (
            TaskSerializer,  # Local import to avoid circular import
        )

        tasks = obj.tasks.all()
        return TaskSerializer(tasks, many=True, read_only=True).data
