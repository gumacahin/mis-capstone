from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from upoutodo.models import Project
from upoutodo.serializers import ProjectDetailSerializer, ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset.filter(created_by=user)
        pk = self.kwargs.get("pk")
        if pk:
            return queryset
        return queryset.filter(is_default=False)

    def get_serializer_class(self):
        if self.action == "list":
            return super().get_serializer_class()
        return ProjectDetailSerializer

    @action(detail=False, methods=["get"], url_path="inbox")
    def inbox(self, request):
        user = request.user
        project = Project.objects.get(created_by=user, is_default=True)
        serializer = self.get_serializer(project)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.instance
        isOnlyUpdatingView = set(serializer.validated_data.keys()) == {"view"}
        if instance.is_default and not isOnlyUpdatingView:
            raise serializers.ValidationError(
                "Only 'view' can be updated in the default project."
            )
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        if instance.is_default:
            raise serializers.ValidationError("The default project cannot be deleted.")
        instance.delete()
