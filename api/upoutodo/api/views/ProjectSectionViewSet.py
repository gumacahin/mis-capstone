from django.db import models
from rest_framework import permissions, viewsets

from upoutodo.api.models import ProjectSection
from upoutodo.api.serializers import ProjectSectionSerializer


class ProjectSectionViewSet(viewsets.ModelViewSet):
    queryset = ProjectSection.objects.all()
    serializer_class = ProjectSectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().filter(project__created_by=user, is_default=False)

    def perform_create(self, serializer):
        max_order = self.get_queryset().aggregate(models.Max("order"))["order__max"]
        if max_order is not None:
            serializer.save(order=max_order + 1)
        else:
            serializer.save(order=0)
