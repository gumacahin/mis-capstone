from rest_framework import serializers

from upoutodo.models import Project
from upoutodo.serializers.project_section import ProjectSectionSerializer


class ProjectAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]


class BaseProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            "id",
            "is_default",
            "title",
            "view",
            "order",
        ]


class ProjectSerializer(BaseProjectSerializer):
    above_project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        required=False,
        write_only=True,
    )
    below_project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        required=False,
        write_only=True,
    )

    class Meta(BaseProjectSerializer.Meta):
        fields = BaseProjectSerializer.Meta.fields + [
            "above_project_id",
            "below_project_id",
        ]


class ProjectDetailSerializer(BaseProjectSerializer):
    sections = ProjectSectionSerializer(many=True, read_only=True)

    class Meta(BaseProjectSerializer.Meta):
        fields = BaseProjectSerializer.Meta.fields + ["sections"]
