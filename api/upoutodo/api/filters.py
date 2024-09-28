from django.utils import timezone
from django_filters.rest_framework import FilterSet, BooleanFilter
from todo.models import Task


class TaskFilter(FilterSet):
    today = BooleanFilter(method="filter_today")
    inbox = BooleanFilter(method="filter_inbox")
    upcoming = BooleanFilter(method="filter_upcoming")

    class Meta:
        model = Task
        fields = ["today", "inbox", "upcoming"]

    def filter_today(self, queryset, name, value):
        if value:
            today = timezone.now().date()
            return queryset.filter(due_date__lte=today)
        return queryset

    def filter_inbox(self, queryset, name, value):
        if value:
            return queryset.filter(due_date__isnull=True)
        return queryset

    def filter_upcoming(self, queryset, name, value):
        if value:
            today = timezone.now().date()
            return queryset.filter(due_date__gt=today)
        return queryset
