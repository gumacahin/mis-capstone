from rest_framework import serializers

from upoutodo.models import Project


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
    sections = serializers.SerializerMethodField()

    class Meta(BaseProjectSerializer.Meta):
        fields = BaseProjectSerializer.Meta.fields + ["sections"]

    def get_sections(self, obj):
        # Avoid circular import by importing here
        from upoutodo.serializers import ProjectSectionSerializer

        sections = obj.sections.all()
        return ProjectSectionSerializer(sections, many=True).data
