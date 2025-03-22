import os

from django.contrib import admin

from upoutodo.api.models import Project, Task, UserProfile

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Project)
admin.site.register(Task)

# Read the environment variable
ENVIRONMENT = os.getenv("DJANGO_ENV", "development")

admin.site.index_title = f"Admin [{ENVIRONMENT=}]"
admin.site.site_title = "UPOU TODO"
admin.site.site_header = "UPOU Todo Admin"
