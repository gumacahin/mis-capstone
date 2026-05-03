from rest_framework import serializers

from upoutodo.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "type", "title", "message", "is_read", "task", "created_at"]
        read_only_fields = ["id", "type", "title", "message", "task", "created_at"]
