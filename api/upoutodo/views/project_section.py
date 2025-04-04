from django.db import models, transaction
from rest_framework import permissions, serializers, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from upoutodo.models import ProjectSection
from upoutodo.serializers import ProjectSectionSerializer


class ProjectSectionViewSet(viewsets.ModelViewSet):
    queryset = ProjectSection.objects.all()
    serializer_class = ProjectSectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().filter(project__created_by=user, is_default=False)

    @action(methods=["put"], detail=False)
    def bulk_update(self, request):
        ids = [i["id"] for i in request.data]

        # Fetch the corresponding objects from the database
        sections = self.get_queryset().filter(id__in=ids)

        # Create a mapping of id -> order from the request data
        id_to_order_map = {item["id"]: item["order"] for item in request.data}

        # Update the order field for each section
        for section in sections:
            section.order = id_to_order_map.get(section.id)

        # Use bulk_update for efficient database updates
        with transaction.atomic():
            ProjectSection.objects.bulk_update(sections, ["order"])

        return Response(status=status.HTTP_204_NO_CONTENT)

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

    def perform_destroy(self, instance):
        if instance.is_default:
            raise serializers.ValidationError("Default section cannot be deleted.")
        order = instance.order
        project = instance.project
        with transaction.atomic():
            instance.delete()
            ProjectSection.objects.filter(order__gt=order, project=project).update(
                order=models.F("order") - 1
            )
