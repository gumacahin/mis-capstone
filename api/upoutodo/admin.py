import os

import taggit.models
from django.contrib import admin

from upoutodo.models import (
    EnergyCheckIn,
    PlanItem,
    Project,
    Tag,
    Task,
    TodayPlan,
    UserProfile,
)

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Project)
admin.site.register(Task)
admin.site.register(Tag)
admin.site.register(EnergyCheckIn)
admin.site.register(TodayPlan)
admin.site.register(PlanItem)
admin.site.unregister(taggit.models.Tag)

# Read the environment variable
ENVIRONMENT = os.getenv("DJANGO_ENV", "development")

admin.site.index_title = f"Admin [{ENVIRONMENT=}]"
admin.site.site_title = "UPOU TODO"
admin.site.site_header = "UPOU Todo Admin"
