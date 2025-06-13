# from django.contrib.auth.models import AnonymousUser
# from django.http.request import HttpRequest
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.is_admin
