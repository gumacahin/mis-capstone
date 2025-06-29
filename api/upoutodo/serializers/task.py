from django.contrib.contenttypes.models import ContentType
from django_comments.models import Comment
from rest_framework import serializers
from taggit.serializers import TaggitSerializer, TagListSerializerField

from upoutodo.models import Project, ProjectSection, Task

from .tag import Tag


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
    source_section = serializers.PrimaryKeyRelatedField(
        queryset=ProjectSection.objects.all(),
        write_only=True,
        required=False,
    )
    project_title = serializers.SerializerMethodField(read_only=True)
    section_title = serializers.SerializerMethodField(read_only=True)

    tags = TagListSerializerField(required=False)

    comments_count = serializers.SerializerMethodField(read_only=True)

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
            "order",
            "section",
            "project",
            "above_task",
            "below_task",
            "source_section",
            "section_title",
            "project_title",
            "comments_count",
        ]

    def get_comments_count(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        return Comment.objects.filter(
            content_type=content_type, object_pk=obj.pk
        ).count()

    def get_project_title(self, obj):
        return obj.section.project.title

    def get_section_title(self, obj):
        section_title = obj.section.title
        if section_title == Project.DEFAULT_PROJECT_SECTION_TITLE:
            return None
        return section_title

    def validate(self, data):
        above_task = data.pop("above_task", None)
        below_task = data.pop("below_task", None)
        source_section = data.pop("source_section", None)

        if above_task and below_task:
            raise serializers.ValidationError(
                "You can only specify one of 'above_task' or 'below_task'."
            )

        self.context["relative_to_task"] = above_task or below_task
        self.context["source_section"] = source_section
        if above_task:
            data["order"] = above_task.order
        elif below_task:
            data["order"] = below_task.order + 1

        return data

    def update(self, instance, validated_data):
        request = self.context.get("request")
        tags_data = validated_data.pop("tags", None)

        # Update other fields
        instance = super().update(instance, validated_data)

        # Handle tags if provided
        if tags_data is not None:
            tag_objects = []
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(
                    name=tag_name, created_by=request.user
                )
                tag_objects.append(tag)
            instance.tags.set(tag_objects)

        return instance


class TaskAdminSerializer(TaskSerializer):
    created_by = serializers.PrimaryKeyRelatedField(
        source="section.project.created_by.id", read_only=True
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False,
    )

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
            "order",
            "project",
            "created_by",
        ]
