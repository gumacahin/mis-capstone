from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from auth0.authentication import Users as Auth0Users
from todo.models import Task, TaskList
from upoutodo.settings import AUTH0
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict

from upoutodo.api.serializers import (
    GroupSerializer,
    UserSerializer,
    TaskSerializer,
    TaskListSerializer,
)

from functools import wraps
import jwt

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.http import JsonResponse

from rest_framework.filters import OrderingFilter


def get_token_auth_header(request):
    """Obtains the Access Token from the Authorization Header"""
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    parts = auth.split()
    token = parts[1]

    return token


# FIXME: This does not work.
def requires_scope(required_scope):
    """Determines if the required scope is present in the Access Token
    Args:
        required_scope (str): The scope required to access the resource
    """

    def require_scope(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = get_token_auth_header(args[0])
            decoded = jwt.decode(token, verify=False, algorithms=["RS256"])
            if decoded.get("scope"):
                token_scopes = decoded["scope"].split()
                for token_scope in token_scopes:
                    if token_scope == required_scope:
                        return f(*args, **kwargs)
            response = JsonResponse(
                {"message": "You don't have access to this resource"}
            )
            response.status_code = 403
            return response

        return decorated

    return require_scope


@api_view(["GET"])
@permission_classes([AllowAny])
def public(request):
    return JsonResponse(
        {
            "message": "Hello from a public endpoint! You don't need to be authenticated to see this."
        }
    )


@api_view(["GET"])
def private(request):
    return JsonResponse(
        {
            "message": "Hello from a private endpoint! You need to be authenticated to see this."
        }
    )


# FIXME: This is not working
# But this could be unnecessary.
# I followed this https://auth0.com/docs/quickstart/backend/django/01-authorization
# Adding the required param will result in another error.
@api_view(["GET"])
@requires_scope("read:messages")
def private_scoped(request):
    return JsonResponse(
        {
            "message": "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this."
        }
    )


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=["GET"], detail=False)
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    # TODO: Understand what this is for
    def partial_update(self, request, pk=None, *args, **kwargs):
        user = self.queryset.get(id=pk)
        user.profile: UserProfile

        if (is_admin := data.get("is_admin")) is not None:
            user.profile.is_admin = is_admin

        data = request.data
        username = data["name"]
        user.profile.name = username
        user.profile.save()


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows todos to be viewed or edited.
    """

    queryset = Task.objects.all().order_by("priority")
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [OrderingFilter]
    # ordering_fields = ['priority', 'due_date', 'created_date', 'title']
    ordering = ["-priority", "due_date", "created_date"]

    def get_queryset(self):
        return super().get_queryset().filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, assigned_to=self.request.user)


class TaskListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows task lists to be viewed or edited.
    """

    queryset = TaskList.objects.all()
    serializer_class = TaskListSerializer
    permission_classes = [permissions.IsAuthenticated]
