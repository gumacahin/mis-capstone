from datetime import datetime
from django.contrib.auth.models import Group, User
from rest_framework import serializers
from todo.models import Task, TaskList, Comment


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "first_name", "last_name", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class NullableDateField(serializers.DateField):
    def to_internal_value(self, data):
        if data == "":
            return None
        if isinstance(data, datetime):
            data = data.date()
        return super().to_internal_value(data)

    def to_representation(self, value):
        if isinstance(value, datetime):
            value = value.date()
        return super().to_representation(value)


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    created_date = NullableDateField(required=False)
    due_date = NullableDateField(allow_null=True, required=False)
    completed_date = NullableDateField(required=False)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "task_list",
            "created_date",
            "due_date",
            "completed",
            "completed_date",
            "created_by",
            "assigned_to",
            "note",
            "priority",
        ]


class TaskListSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TaskList
        fields = ["name", "slug", "group"]


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    author_name = serializers.SerializerMethodField()
    task_id = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "author_name",
            "author",
            "body",
            "date",
            "task_id",
        ]

    def get_author_name(self, obj):
        if obj.author.first_name and obj.author.last_name:
            return obj.author.first_name + " " + obj.author.last_name[:1]
        if obj.author.first_name:
            return obj.author.first_name
        return obj.author.username

    def get_task_id(self, obj):
        return obj.task.id
