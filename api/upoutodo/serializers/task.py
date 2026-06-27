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

    # RRULE fields with explicit null handling
    rrule = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    dtstart = serializers.DateTimeField(required=False, allow_null=True)
    anchor_mode = serializers.ChoiceField(
        choices=Task.AnchorMode.choices,
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    tags = TagListSerializerField(required=False)

    comments_count = serializers.SerializerMethodField(read_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return

        owned_sections = ProjectSection.objects.filter(project__created_by=request.user)
        owned_tasks = Task.objects.filter(section__project__created_by=request.user)

        self.fields["section"].queryset = owned_sections
        self.fields["above_task"].queryset = owned_tasks
        self.fields["below_task"].queryset = owned_tasks
        self.fields["source_section"].queryset = owned_sections

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "dtstart",
            "rrule",
            "anchor_mode",
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

        read_only_fields = ["due_date"]

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

    def to_representation(self, instance):
        """Convert model instance to serialized representation."""
        data = super().to_representation(instance)

        # Convert empty strings to None for RRULE fields to match API expectations
        if data.get("rrule") == "":
            data["rrule"] = None
        if data.get("anchor_mode") == "":
            data["anchor_mode"] = None

        return data

    def to_internal_value(self, data):
        """Convert serialized data to internal Python representation."""
        # Only convert None values to empty strings for model compatibility
        # Don't modify existing non-None values
        data_copy = data.copy() if hasattr(data, "copy") else dict(data)

        if data_copy.get("rrule") is None:
            data_copy["rrule"] = ""
        if data_copy.get("anchor_mode") is None:
            data_copy["anchor_mode"] = ""

        return super().to_internal_value(data_copy)

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

        # Calculate due_date from rrule and dtstart
        if data.get("rrule") and data.get("dtstart"):
            from upoutodo.utils import calculate_next_due_date

            due_date = calculate_next_due_date(data["rrule"], data["dtstart"])
            if due_date:
                data["due_date"] = due_date

        return data

    def update(self, instance, validated_data):
        request = self.context.get("request")
        tags_data = validated_data.pop("tags", None)

        # Check if completion_date is being set (task is being completed)
        completion_date = validated_data.get("completion_date")
        was_completed = instance.is_completed

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

        # If task is being completed and it's a recurring task, create next occurrence
        if (
            completion_date
            and not was_completed
            and instance.rrule
            and instance.rrule.strip()
            and instance.dtstart
        ):
            instance._create_next_occurrence()

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
            "dtstart",
            "rrule",
            "anchor_mode",
            "due_date",
            "priority",
            "tags",
            "completion_date",
            "order",
            "project",
            "created_by",
        ]
