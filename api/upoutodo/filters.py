from datetime import datetime, time

from django.utils import timezone
from django_filters.rest_framework import (
    BooleanFilter,
    CharFilter,
    DateFilter,
    FilterSet,
)

from upoutodo.models import Task


class TaskFilter(FilterSet):
    tag = CharFilter(method="filter_tag")
    today = BooleanFilter(method="filter_today")
    inbox = BooleanFilter(method="filter_inbox")
    upcoming = BooleanFilter(method="filter_upcoming")
    start_date = DateFilter(method="filter_start_date")
    end_date = DateFilter(method="filter_end_date")

    class Meta:
        model = Task
        fields = ["today", "inbox", "upcoming", "start_date", "end_date", "tag"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.start_date_value = None
        self.end_date_value = None
        self.inbox = None
        self.today = None
        self.upcoming = None
        self.tag = None

    def filter_start_date(self, queryset, name, value):
        """Filter tasks with due_date >= start of the given date."""
        if value:
            # Convert date to start of day in UTC
            start_datetime = timezone.make_aware(datetime.combine(value, time.min))
            return queryset.filter(due_date__gte=start_datetime)
        return queryset

    def filter_end_date(self, queryset, name, value):
        """Filter tasks with due_date <= end of the given date."""
        if value:
            # Convert date to end of day in UTC (23:59:59.999999)
            end_datetime = timezone.make_aware(datetime.combine(value, time.max))
            return queryset.filter(due_date__lte=end_datetime)
        return queryset

    def filter_today(self, queryset, _, value):
        if value:
            today = timezone.localdate()
            return queryset.filter(due_date__date__lte=today)
        return queryset

    def filter_inbox(self, queryset, _, value):
        if value:
            return queryset.filter(due_date__isnull=True)
        return queryset

    def filter_upcoming(self, queryset, _, value):
        if value:
            today = timezone.localdate()
            return queryset.filter(due_date__date__gt=today)
        return queryset

    def filter_tag(self, queryset, _, value):
        if value:
            return queryset.filter(tags__slug=value)
        return queryset


class CommentFilter(FilterSet):
    task = CharFilter(method="filter_task")

    def filter_task(self, queryset, _, value):
        if value:
            return queryset.filter(object_pk=value)
        return queryset
