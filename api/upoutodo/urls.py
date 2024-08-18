from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path
from django.views.generic import TemplateView
from rest_framework import routers

from upoutodo.api import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"tasks", views.TaskViewSet)
router.register(r"tasklists", views.TaskListViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("", TemplateView.as_view(template_name="home.html"), name="home"),
    path("login", auth_views.LoginView.as_view(), name="login"),
    path("logout", auth_views.LogoutView.as_view(), name="logout"),
    path("gtdadmin/", admin.site.urls),
    path("todo/", include("todo.urls", namespace="todo")),
    path("api/public", views.public),
    path("api/private", views.private),
    path("api/private-scoped", views.private_scoped),
]
