from django.db import models, transaction
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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

        sections = self.get_queryset().filter(id__in=ids)

        id_to_order_map = {item["id"]: item["order"] for item in request.data}

        for section in sections:
            section.order = id_to_order_map.get(section.id)

        ProjectSection.objects.bulk_update(sections, ["order"])

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["post"], detail=True)
    def duplicate(self, request, pk=None):
        section = self.get_object()
        section.pk = None
        section.title = f"Copy of {section.title}"
        section.save()
        original_section = ProjectSection.objects.get(pk=pk)
        for task in original_section.tasks.all():
            task.pk = None
            task.section = section
            task.save()

        return Response(status=status.HTTP_201_CREATED)

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

        source_project = serializer.validated_data.get("source_project")
        destination_project = serializer.validated_data.get("project")

        if destination_project != source_project:
            source_project_sections = ProjectSection.objects.filter(
                is_default=False, project=source_project
            ).order_by("order")
            for order, section in enumerate(source_project_sections, start=1):
                section.order = order
            ProjectSection.objects.bulk_update(source_project_sections, ["order"])
            max_order = (
                destination_project.sections.aggregate(max_order=models.Max("order"))[
                    "max_order"
                ]
                # The default section is always 0 but just in case
                or 0
            )
            serializer.save(
                order=max_order + 1,
            )

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
