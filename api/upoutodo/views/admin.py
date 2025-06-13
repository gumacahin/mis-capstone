from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from upoutodo.permissions import IsAdmin
from upoutodo.serializers.project import ProjectAdminSerializer
from upoutodo.serializers.tag import TagAdminSerializer
from upoutodo.serializers.task import TaskAdminSerializer
from upoutodo.views.project import ProjectViewSet
from upoutodo.views.tag import TagViewSet
from upoutodo.views.task import TaskViewSet
from upoutodo.views.user import UserViewSet


class AdminPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class AdminViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = AdminPagination

    def get_queryset(self):
        return self.queryset


class AdminTaskViewSet(AdminViewSet):
    queryset = TaskViewSet.queryset
    serializer_class = TaskAdminSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["id", "title", "due_date", "priority", "completion_date"]

    # def perform_update(self, serializer):
    #     ModelViewSet.perform_update(self, serializer)


class AdminProjectViewSet(AdminViewSet, ProjectViewSet):
    serializer_class = ProjectAdminSerializer


class AdminUserViewSet(AdminViewSet, UserViewSet):
    pass


class AdminTagViewSet(AdminViewSet, TagViewSet):
    serializer_class = TagAdminSerializer
    lookup_field = "id"
