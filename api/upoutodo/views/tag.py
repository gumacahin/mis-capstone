from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from upoutodo.models import Tag
from upoutodo.serializers import TagDetailSerializer, TagSerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by("name")
    permission_classes = [IsAuthenticated]
    serializer_class = TagSerializer
    lookup_field = "slug"

    def get_queryset(self):
        user = self.request.user
        tags = super().get_queryset().filter(created_by=user).distinct()
        return tags

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TagDetailSerializer
        return super().get_serializer_class()
