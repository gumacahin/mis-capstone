from django.contrib.contenttypes.models import ContentType
from django.contrib.sites.models import Site
from django.db.models import CharField, Subquery
from django.db.models.functions import Cast
from django_comments.models import Comment
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from upoutodo.filters import CommentFilter
from upoutodo.models import Task
from upoutodo.serializers import CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(is_public=True, is_removed=False).order_by(
        "submit_date"
    )
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CommentFilter

    def get_queryset(self):
        current_site = Site.objects.get_current()
        task_content_type = ContentType.objects.get_for_model(Task)
        owned_task_ids = (
            Task.objects.filter(section__project__created_by=self.request.user)
            .annotate(object_pk=Cast("pk", output_field=CharField()))
            .values("object_pk")
        )
        return (
            super()
            .get_queryset()
            .filter(
                site_id=current_site.id,
                content_type=task_content_type,
                object_pk__in=Subquery(owned_task_ids),
            )
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
