from django.db import models, transaction
from rest_framework import permissions, viewsets, serializers

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

            # Shift existing items down
            ProjectSection.objects.filter(order__gte=requested_order).update(
                order=models.F("order") + 1
            )
            serializer.save(order=requested_order)

    def perform_update(self, serializer):
        instance = serializer.instance
        if instance.is_default:
            raise serializers.ValidationError("Cannot update default section")

        with transaction.atomic():
            new_order = serializer.validated_data.get("order")

            if new_order and new_order != instance.order:
                if new_order > instance.order:
                    # Move down: Shift items up
                    ProjectSection.objects.filter(
                        order__gt=instance.order, order__lte=new_order
                    ).update(order=models.F("order") - 1)
                else:
                    # Move up: Shift items down
                    ProjectSection.objects.filter(
                        order__lt=instance.order, order__gte=new_order
                    ).update(order=models.F("order") + 1)

            serializer.save(order=new_order)
