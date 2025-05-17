from django.contrib.sites.models import Site
from django_comments.models import Comment
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from upoutodo.filters import CommentFilter
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
        return super().get_queryset().filter(site_id=current_site.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
