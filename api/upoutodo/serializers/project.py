from rest_framework import serializers

from upoutodo.models import Project
from upoutodo.serializers import ProjectSectionSerializer


class BaseProjectSerializer(serializers.HyperlinkedModelSerializer):

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
    pass


class ProjectDetailSerializer(BaseProjectSerializer):
    sections = ProjectSectionSerializer(many=True, read_only=True)

    class Meta(BaseProjectSerializer.Meta):
        fields = BaseProjectSerializer.Meta.fields + ["sections"]
