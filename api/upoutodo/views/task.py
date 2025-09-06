from datetime import datetime

from django.db import models, transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response

from upoutodo.filters import TaskFilter
from upoutodo.models import Task
from upoutodo.serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = TaskFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering = ["order", "-due_date", "completion_date"]

    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().filter(section__project__created_by=user)

    def perform_update(self, serializer):
        new_order = serializer.validated_data.get("order", serializer.instance.order)
        current_order = serializer.instance.order
        destination_section = serializer.validated_data.get(
            "section", serializer.instance.section
        )
        source_section = serializer.context.get(
            "source_section", serializer.instance.section
        )
        is_sorting = destination_section != source_section or new_order != current_order

        with transaction.atomic():
            serializer.save()
            if is_sorting:
                destination_section = (
                    source_section
                    if source_section == destination_section
                    else destination_section
                )
                Task.objects.filter(
                    section=source_section, order__gt=current_order
                ).exclude(id=serializer.instance.id).update(order=models.F("order") - 1)
                Task.objects.filter(
                    section=destination_section,
                    order__gte=new_order,
                ).exclude(id=serializer.instance.id).update(order=models.F("order") + 1)

    def perform_destroy(self, instance):
        section = instance.section
        order = instance.order

        Task.objects.filter(section=section, order__gt=order).update(
            order=models.F("order") - 1
        )

        instance.delete()

    def perform_create(self, serializer):
        relative_to_task = serializer.context.get("relative_to_task")
        section = serializer.validated_data.get("section")
        order = serializer.validated_data.get("order")
        if relative_to_task:
            Task.objects.filter(section=section, order__gte=order).update(
                order=models.F("order") + 1
            )
            serializer.save()
        else:
            max_order = Task.objects.filter(section__project=section.project).aggregate(
                models.Max("order")
            )["order__max"]
            serializer.save(
                order=max_order + 1 if max_order else 1,
            )

    @action(detail=True, methods=["post"], url_path="duplicate")
    def duplicate(self, request, pk=None):
        task = self.get_object()
        tags = task.tags.all()
        task.pk = None
        task.save()

        for tag in tags:
            task.tags.add(tag)

        return Response(status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["put", "patch"], url_path="bulk_update")
    def bulk_update(self, request):
        if not isinstance(request.data, list):
            return Response(
                {"error": "Expected a list of task objects."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        partial = request.method == "PATCH" or request.method == "PUT"

        for task_data in request.data:
            task_id = task_data.get("id")
            if not task_id:
                return Response(
                    {"error": "'id' field is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                return Response(
                    {"error": f"Task with id {task_id} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer = self.get_serializer(task, data=task_data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"])
    def generate_occurrences(self, request, pk=None):
        """Generate occurrences for a recurring task within date range"""
        task = self.get_object()

        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        if not start_date or not end_date:
            return Response({"error": "start_date and end_date required"}, status=400)

        try:
            start = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
            end = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
            occurrences = task.get_occurrences_in_range(start, end, request.user)

            return Response({"occurrences": [occ.isoformat() for occ in occurrences]})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    @action(detail=True, methods=["post"])
    def refresh_due_date(self, request, pk=None):
        """Manually refresh the cached due_date"""
        task = self.get_object()
        task.update_due_date_cache(request.user)
        return Response({"due_date": task.due_date})
