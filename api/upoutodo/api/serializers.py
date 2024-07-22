from django.contrib.auth.models import Group, User
from rest_framework import serializers
from todo.models import Task, TaskList
from datetime import datetime


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class DateFromDateTimeField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, datetime):
            return value.date()
        return value

    def to_internal_value(self, data):
        return data


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    created_date = DateFromDateTimeField(required=False)
    due_date = DateFromDateTimeField(required=False)
    completed_date = DateFromDateTimeField(required=False)

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
