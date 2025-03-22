from rest_framework import serializers

from upoutodo.api.models import Project
from upoutodo.api.serializers import ProjectSectionSerializer


class BaseProjectSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Project
        fields = ["id", "title", "created_at", "updated_at"]


class ProjectSerializer(BaseProjectSerializer):
    pass


class ProjectDetailSerializer(BaseProjectSerializer):
    sections = ProjectSectionSerializer(many=True, read_only=True)

    class Meta(BaseProjectSerializer.Meta):
        fields = BaseProjectSerializer.Meta.fields + ["sections"]
