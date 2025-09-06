from dateutil import rrule
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

    # NEW: RRULE field (input/output) - optional for tasks without due dates
    rrule = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    # MODIFIED: due_date becomes read-only (cached value)
    due_date = serializers.DateTimeField(read_only=True)

    tags = TagListSerializerField(required=False)

    comments_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "rrule",  # NEW
            "due_date",  # Now read-only
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

    def validate_rrule(self, value):
        """Validate RRULE format"""
        if not value:
            # Allow empty/null RRULE for tasks without due dates
            return value

        try:
            rrule.rrulestr(value)
        except Exception as e:
            raise serializers.ValidationError(f"Invalid RRULE format: {str(e)}")
        return value

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

    def create(self, validated_data):
        """Create task and update due_date cache in user's timezone"""
        instance = super().create(validated_data)
        if instance.rrule:
            user = (
                self.context.get("request").user
                if self.context.get("request")
                else None
            )
            instance.update_due_date_cache(user)
        else:
            # No RRULE means no due date
            instance.due_date = None
            instance.save(update_fields=["due_date"])
        return instance

    def update(self, instance, validated_data):
        """Update task and handle completion logic in user's timezone"""
        rrule_changed = "rrule" in validated_data
        completion_changed = "completion_date" in validated_data

        instance = super().update(instance, validated_data)

        user = self.context.get("request").user if self.context.get("request") else None

        if rrule_changed:
            if instance.rrule:
                instance.update_due_date_cache(user)
            else:
                # No RRULE means no due date
                instance.due_date = None
                instance.save(update_fields=["due_date"])
        elif completion_changed and instance.completion_date and instance.is_recurring:
            # Task was just completed and is recurring - update to next occurrence
            instance.update_due_date_cache(user)
        elif (
            completion_changed
            and not instance.completion_date
            and instance.is_recurring
        ):
            # Task was marked incomplete and is recurring - restore next occurrence
            instance.update_due_date_cache(user)

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
            "rrule",  # NEW
            "due_date",  # Now read-only
            "priority",
            "tags",
            "completion_date",
            "order",
            "project",
            "created_by",
        ]
