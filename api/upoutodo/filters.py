from django.utils import timezone
from django_filters.rest_framework import BooleanFilter, DateFilter, FilterSet

from upoutodo.models import Task


class TaskFilter(FilterSet):
    today = BooleanFilter(method="filter_today")
    inbox = BooleanFilter(method="filter_inbox")
    upcoming = BooleanFilter(method="filter_upcoming")
    start_date = DateFilter(field_name="due_date", lookup_expr="gte")
    end_date = DateFilter(field_name="due_date", lookup_expr="lte")

    class Meta:
        model = Task
        fields = ["today", "inbox", "upcoming", "start_date", "end_date"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.start_date_value = None
        self.end_date_value = None
        self.inbox = None
        self.today = None
        self.upcoming = None

    def filter_start_end_date(self, queryset, name, value):
        if name == "start_date":
            self.start_date_value = value
        elif name == "end_date":
            self.end_date_value = value

        if self.start_date_value and self.end_date_value:
            return queryset.filter(
                due_date__gte=self.start_date_value, due_date__lte=self.end_date_value
            )
        return queryset

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
