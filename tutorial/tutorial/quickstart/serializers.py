from django.contrib.auth.models import Group, User
from rest_framework import serializers
from todo.models import Task


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'task_list', 'created_date', 'due_date', 'completed', 'completed_date', 'created_by', 'assigned_to', 'note', 'priority']
