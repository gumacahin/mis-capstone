from django.db import models, transaction
from rest_framework import permissions, viewsets

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
        """
        Insert a new item at the requested order position, shifting existing items.
        """
        with transaction.atomic():
            requested_order = serializer.validated_data.get("order")

            if requested_order is None:
                # If order is not provided, place at the end
                max_order = (
                    ProjectSection.objects.aggregate(models.Max("order"))["order__max"]
                    or 0
                )
                serializer.save(order=max_order + 1)
            else:
                # Shift existing items down
                ProjectSection.objects.filter(order__gt=requested_order).update(
                    order=models.F("order") + 1
                )
                serializer.save(order=requested_order)

    def perform_update(self, serializer):
        with transaction.atomic():
            instance = serializer.instance
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
