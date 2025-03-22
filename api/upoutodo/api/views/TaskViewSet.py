from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response

from upoutodo.api.filters import TaskFilter
from upoutodo.api.models import Task
from upoutodo.api.serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = TaskFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering = ["-priority", "due_date"]

    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().filter(section__project__created_by=user)

    def perform_create(self, serializer):
        """Assign default section if it is not provided."""

        validated_section = serializer.validated_data.get("section")

        if not validated_section:
            inbox = self.request.user.profile.inbox
            serializer.validated_data["section"] = inbox.default_section

        serializer.save()

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
                task = Task.objects.get(id=task_id, created_by=self.request.user)
            except Task.DoesNotExist:
                return Response(
                    {"error": f"Task with id {task_id} does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            serializer = self.get_serializer(task, data=task_data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response(
            {"status": "Tasks updated successfully"}, status=status.HTTP_200_OK
        )
