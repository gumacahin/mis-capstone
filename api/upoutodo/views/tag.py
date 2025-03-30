from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from upoutodo.models import Task
from upoutodo.serializers import TagSerializer
from taggit.models import Tag


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TagSerializer

    def get_queryset(self):
        user = self.request.user
        tasks = Task.objects.filter(section__project__created_by=user)
        tags = (
            super()
            .get_queryset()
            .filter(
                taggit_taggeditem_items__object_id__in=tasks.values_list(
                    "id", flat=True
                ),
                taggit_taggeditem_items__content_type__model="task",
            )
            .distinct()
        )
        return tags
