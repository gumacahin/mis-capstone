from django.contrib.contenttypes.models import ContentType
from django.contrib.sites.models import Site
from django_comments.models import Comment
from rest_framework import serializers


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

    def create(self, validated_data):
        request = self.context.get("request")
        if request and not validated_data.get("user") and request.user.is_authenticated:
            validated_data["user"] = request.user
        validated_data["site_id"] = Site.objects.get_current().id
        validated_data["content_type"] = ContentType.objects.get(
            app_label="upoutodo", model="task"
        )
        return super().create(validated_data)
