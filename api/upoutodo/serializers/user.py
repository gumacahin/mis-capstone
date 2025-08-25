from django.contrib.auth import get_user_model
from rest_framework import serializers

from upoutodo.models import Project, ProjectSection

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


class UserSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.SerializerMethodField()
    notification_email = serializers.EmailField(
        source="profile.notification_email",
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    email_for_notifications = serializers.SerializerMethodField()
    is_student = serializers.BooleanField(source="profile.is_student")
    is_faculty = serializers.BooleanField(source="profile.is_faculty")
    is_onboarded = serializers.BooleanField(source="profile.is_onboarded")
    theme = serializers.CharField(source="profile.theme")
    projects = ProjectSerializer(source="created_projects", many=True)

    def get_projects(self, obj):
        projects = obj.projects.all()
        return ProjectSerializer(projects, many=True).data

    def get_name(self, obj):
        if obj.profile.name:
            return obj.profile.name
        return f"User {obj.id}"

    def get_email_for_notifications(self, obj):
        return obj.profile.email_for_notifications

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "notification_email",
            "email_for_notifications",
            "is_faculty",
            "is_student",
            "is_onboarded",
            "projects",
            "theme",
        ]
        read_only_fields = [
            "id",
            "projects",
            "email",
            "email_for_notifications",
        ]
