from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import routers

from upoutodo import views
from upoutodo.views.admin import AdminDashboardView
from upoutodo.views.email import daily_digest
from upoutodo.views.productivity import UserProductivityView

router = routers.DefaultRouter()
router.register(r"project_sections", views.ProjectSectionViewSet)
router.register(r"projects", views.ProjectViewSet)
router.register(r"tags", views.TagViewSet)
router.register(r"comments", views.CommentViewSet)
router.register(r"tasks", views.TaskViewSet)
router.register(r"users", views.UserViewSet)
router.register(r"notifications", views.NotificationViewSet, basename="notification")
router.register(r"planner", views.PlannerViewSet, basename="planner")

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("login", auth_views.LoginView.as_view(), name="login"),
    path("logout", auth_views.LogoutView.as_view(), name="logout"),
    path("upoutodo-admin/", admin.site.urls),
    path(
        "api/dashboard",
        AdminDashboardView.as_view(),
        name="admin-dashboard",
    ),
    path(
        "api/productivity",
        UserProductivityView.as_view(),
        name="user-productivity",
    ),
    path(
        "api/email/daily-digest",
        daily_digest,
        name="daily-digest",
    ),
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
