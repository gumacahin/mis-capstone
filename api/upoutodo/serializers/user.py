from django.contrib.auth import get_user_model
from rest_framework import serializers

from upoutodo.models import Project, ProjectSection, UserProfile

User = get_user_model()


class ProjectSectionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    title = serializers.CharField(max_length=255)
    is_default = serializers.BooleanField()

    class Meta:
        model = ProjectSection
        fields = ["id", "title", "is_default"]
        read_only_fields = ["id", "title", "is_default"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "sections", "is_default"]
        read_only_fields = ["id", "title", "sections", "is_default"]

    title = serializers.CharField()
    sections = ProjectSectionSerializer(many=True)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["is_faculty", "is_student", "name"]


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = UserProfileSerializer()
    projects = ProjectSerializer(source="created_projects", many=True)

    def get_projects(self, obj):
        projects = obj.projects.all()
        return ProjectSerializer(projects, many=True).data

    class Meta:
        model = User
        fields = [
            "id",
            "profile",
            "projects",
        ]
        read_only_fields = ["id", "profile", "projects"]
