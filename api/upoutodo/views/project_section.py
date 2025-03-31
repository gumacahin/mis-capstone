from django.db import models, transaction
from rest_framework import permissions, serializers, viewsets

from upoutodo.models import ProjectSection
from upoutodo.serializers import ProjectSectionSerializer


class ProjectSectionViewSet(viewsets.ModelViewSet):
    queryset = ProjectSection.objects.all()
    serializer_class = ProjectSectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().filter(project__created_by=user, is_default=False)

    def perform_create(self, serializer):
        with transaction.atomic():
            # see ProjectSectionSerializer.validate
            requested_order = serializer.validated_data["order"]
            project = serializer.validated_data["project"]

            # Shift existing items down
            ProjectSection.objects.filter(
                order__gte=requested_order, project=project
            ).update(order=models.F("order") + 1)
            serializer.save(order=requested_order)

    def perform_update(self, serializer):
        instance = serializer.instance
        if instance.is_default:
            raise serializers.ValidationError("Cannot update default section.")
        super().perform_update(serializer)
