from django.contrib.contenttypes.models import ContentType
from django.contrib.sites.models import Site
from django_comments.models import Comment
from rest_framework import serializers

from upoutodo.models import Task


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id",
            "object_pk",
            "user",
            "user_name",
            "comment",
            "submit_date",
        ]
        read_only_fields = ["id", "user", "user_name", "submit_date"]

    def validate_object_pk(self, value):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication is required.")

        try:
            task_exists = Task.objects.filter(
                pk=value, section__project__created_by=request.user
            ).exists()
        except (TypeError, ValueError):
            task_exists = False

        if not task_exists:
            raise serializers.ValidationError("Task does not exist.")

        return value

    def create(self, validated_data):
        request = self.context.get("request")
        if request and not validated_data.get("user") and request.user.is_authenticated:
            validated_data["user"] = request.user
        validated_data["site_id"] = Site.objects.get_current().id
        validated_data["content_type"] = ContentType.objects.get(
            app_label="upoutodo", model="task"
        )
        return super().create(validated_data)
