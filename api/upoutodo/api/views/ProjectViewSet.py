from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from upoutodo.api.models import Project
from upoutodo.api.serializers import ProjectDetailSerializer, ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(created_by=user, is_default=False)

    @action(detail=False, methods=["get"], url_path="inbox")
    def inbox(self, request):
        user = request.user
        project = Project.objects.get(created_by=user, is_default=True)
        serializer = ProjectDetailSerializer(project)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
