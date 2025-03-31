from django.db import models, transaction
from django.db.models import Max
from rest_framework import permissions, serializers, viewsets

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

    def perform_create(self, serializer):
        above_project_id = self.request.data.get("above_project_id", None)
        below_project_id = self.request.data.get("below_project_id", None)
        if above_project_id and below_project_id:
            serializer.ValidationError(
                "above_project_id and below_project_id can't be both set."
            )
        if above_project_id:
            self._create_project_above(serializer, above_project_id)
            return
        if below_project_id:
            self._create_project_below(serializer, below_project_id)
            return

        # Otherwise add to the end
        max_order = (
            Project.objects.filter(
                is_default=False, created_by=self.request.user
            ).aggregate(max_order=Max("order"))["max_order"]
            or 0
        )
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
            order=max_order + 1,
        )

    def _create_project_above(self, serializer, above_project_id):
        above_project = Project.objects.get(id=above_project_id)
        order = above_project.order
        with transaction.atomic():
            # Shift existing items down
            Project.objects.filter(
                order__gte=order, created_by=self.request.user
            ).update(order=models.F("order") + 1)
            serializer.save(
                created_by=self.request.user,
                updated_by=self.request.user,
                order=order,
            )

    def _create_project_below(self, serializer, below_project_id):
        below_project = Project.objects.get(id=below_project_id)
        order = below_project.order
        with transaction.atomic():
            # Shift existing items down
            Project.objects.filter(
                order__gt=order, created_by=self.request.user
            ).update(order=models.F("order") + 1)
            serializer.save(
                created_by=self.request.user,
                updated_by=self.request.user,
                order=order + 1,
            )

    def perform_update(self, serializer):
        instance = serializer.instance
        is_only_updating_view = set(serializer.validated_data.keys()) == {"view"}
        if instance.is_default and not is_only_updating_view:
            raise serializers.ValidationError(
                "Only 'view' can be updated in the default project."
            )
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        if instance.is_default:
            raise serializers.ValidationError("The default project cannot be deleted.")
        order = instance.order
        with transaction.atomic():
            instance.delete()
            Project.objects.filter(
                order__gt=order, created_by=self.request.user
            ).update(order=models.F("order") - 1)
