from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path
from rest_framework import routers

from upoutodo.api import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"tasks", views.TaskViewSet)
router.register(r"projects", views.ProjectViewSet)
router.register(r"project_sections", views.ProjectSectionViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("login", auth_views.LoginView.as_view(), name="login"),
    path("logout", auth_views.LogoutView.as_view(), name="logout"),
    path("admin/", admin.site.urls),
]
