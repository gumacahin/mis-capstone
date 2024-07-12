# FIXME: This is not working. I attempted to add a user profile model but failed.
from django.contrib import admin
from .models import UserProfile

# Register your models here.
admin.site.register(UserProfile)
