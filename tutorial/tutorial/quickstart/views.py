from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from todo.models import Task, TaskList

from tutorial.quickstart.serializers import GroupSerializer, UserSerializer, TaskSerializer, TaskListSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows todos to be viewed or edited.
    """
    queryset = Task.objects.all().order_by('priority')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows task lists to be viewed or edited.
    """
    queryset = Task.objects.all().order_by('priority')
    serializer_class = TaskListSerializer
    permission_classes = [permissions.IsAuthenticated]
