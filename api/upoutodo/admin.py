import os

import taggit.models
from django.contrib import admin

from upoutodo.models import UserProfile

# Register your models here.
admin.site.register(UserProfile)
admin.site.unregister(taggit.models.Tag)

# Raw task and planner data is user-private. Admin reporting for these models
# should go through aggregate API endpoints such as /api/dashboard and
# /api/planner/evaluation/.

# Read the environment variable
ENVIRONMENT = os.getenv("DJANGO_ENV", "development")

admin.site.index_title = f"Admin [{ENVIRONMENT=}]"
admin.site.site_title = "UPOU TODO"
admin.site.site_header = "UPOU Todo Admin"
