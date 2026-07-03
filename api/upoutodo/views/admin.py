from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, DurationField, ExpressionWrapper, F
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from upoutodo.models import Task
from upoutodo.permissions import IsAdmin

User = get_user_model()


class AdminMetricTrendSerializer(serializers.Serializer):
    total = serializers.FloatField()
    percent_increase = serializers.FloatField()


class AdminWeeklyTrendSerializer(serializers.Serializer):
    day = serializers.CharField()
    created = serializers.IntegerField()
    completed = serializers.IntegerField()


class AdminPriorityDistributionSerializer(serializers.Serializer):
    priority = serializers.CharField()
    count = serializers.IntegerField()
    percent = serializers.FloatField()
    completion_rate = serializers.FloatField()
    avg_completion_time = serializers.FloatField(allow_null=True)
    overdue_count = serializers.IntegerField()


class AdminDashboardSerializer(serializers.Serializer):
    total_tasks = AdminMetricTrendSerializer()
    active_users = AdminMetricTrendSerializer()
    pending_tasks = AdminMetricTrendSerializer()
    completed_tasks = AdminMetricTrendSerializer()
    weekly_trends = AdminWeeklyTrendSerializer(many=True)
    priority_distribution = AdminPriorityDistributionSerializer(many=True)


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(responses=AdminDashboardSerializer)
    def get(self, request):
        return Response(
            {
                "total_tasks": self.total_tasks(),
                "active_users": self.active_users(),
                "pending_tasks": self.pending_tasks(),
                "completed_tasks": self.completion_rate(),
                "weekly_trends": self.weekly_trends(),
                "priority_distribution": self.priority_distribution(),
            }
        )

    def priority_distribution(self):
        priorities = Task.objects.values("priority").annotate(count=Count("id"))
        total_tasks = Task.objects.count()
        priority_data = []
        for priority in Task.Priority:
            count = next(
                (item["count"] for item in priorities if item["priority"] == priority),
                0,
            )
            percent = (count / total_tasks) * 100 if total_tasks > 0 else 0
            completion_rate = round(
                (
                    Task.objects.filter(
                        priority=priority, completion_date__isnull=False
                    ).count()
                    / count
                    * 100
                    if count > 0
                    else 0
                ),
                2,
            )
            avg_completion_time = (
                Task.objects.filter(priority=priority, completion_date__isnull=False)
                .annotate(
                    duration=ExpressionWrapper(
                        F("completion_date") - F("created_at"),
                        output_field=DurationField(),
                    )
                )
                .aggregate(avg_duration=Avg("duration"))["avg_duration"]
            )
            if avg_completion_time:
                avg_completion_time = round(
                    avg_completion_time.total_seconds() / 86400, 1
                )
            else:
                avg_completion_time = None

            overdue_count = Task.objects.filter(
                priority=priority,
                due_date__lt=timezone.now(),
                completion_date__isnull=True,
            ).count()
            priority_data.append(
                {
                    "priority": priority,
                    "count": count,
                    "percent": percent,
                    "completion_rate": completion_rate,
                    "avg_completion_time": avg_completion_time,
                    "overdue_count": overdue_count,
                }
            )
        return priority_data

    def weekly_trends(self):
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())

        trends = []
        for i in range(7):
            day = start_of_week + timedelta(days=i)
            created_count = Task.objects.filter(created_at__date=day).count()
            completed_count = Task.objects.filter(completion_date__date=day).count()
            trends.append(
                {
                    "day": day.strftime("%a"),
                    "created": created_count,
                    "completed": completed_count,
                }
            )
        return trends

    def active_users(self):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        active_users_count = User.objects.filter(
            last_login__gte=thirty_days_ago
        ).count()
        last_month = thirty_days_ago - timedelta(days=30)
        last_month_active_users_count = User.objects.filter(
            last_login__gte=last_month, last_login__lt=thirty_days_ago
        ).count()
        if last_month_active_users_count == 0:
            percent_increase = 100.0 if active_users_count > 0 else 0.0
        else:
            percent_increase = (
                (active_users_count - last_month_active_users_count)
                / last_month_active_users_count
            ) * 100
        return {
            "total": active_users_count,
            "percent_increase": percent_increase,
        }

    def total_tasks(self):
        total_tasks_count = Task.objects.count()
        thirty_days_ago = timezone.now() - timedelta(days=30)
        last_month = thirty_days_ago - timedelta(days=30)
        last_month_tasks_count = Task.objects.filter(
            created_at__gte=last_month, created_at__lt=thirty_days_ago
        ).count()
        if last_month_tasks_count == 0:
            percent_increase = 100.0 if total_tasks_count > 0 else 0.0
        else:
            percent_increase = (
                (total_tasks_count - last_month_tasks_count) / last_month_tasks_count
            ) * 100
        return {
            "total": total_tasks_count,
            "percent_increase": percent_increase,
        }

    def pending_tasks(self):
        total_tasks_count = Task.objects.filter(completion_date__isnull=True).count()
        thirty_days_ago = timezone.now() - timedelta(days=30)
        last_month = thirty_days_ago - timedelta(days=30)
        last_month_tasks_count = Task.objects.filter(
            created_at__gte=last_month,
            created_at__lt=thirty_days_ago,
            completion_date__isnull=True,
        ).count()
        if last_month_tasks_count == 0:
            percent_increase = 100.0 if total_tasks_count > 0 else 0.0
        else:
            percent_increase = (
                (total_tasks_count - last_month_tasks_count) / last_month_tasks_count
            ) * 100
        return {
            "total": total_tasks_count,
            "percent_increase": percent_increase,
        }

    def completion_rate(self):
        completed_tasks_count = Task.objects.filter(
            completion_date__isnull=False
        ).count()
        total_tasks_count = Task.objects.count()
        if total_tasks_count == 0:
            return 0.0
        completion_rate = (completed_tasks_count / total_tasks_count) * 100

        thirty_days_ago = timezone.now() - timedelta(days=30)
        last_month = thirty_days_ago - timedelta(days=30)
        last_month_completed_tasks_count = Task.objects.filter(
            created_at__gte=last_month,
            created_at__lt=thirty_days_ago,
            completion_date__isnull=False,
        ).count()
        last_month_total_tasks_count = Task.objects.filter(
            created_at__gte=last_month, created_at__lt=thirty_days_ago
        ).count()

        if last_month_total_tasks_count == 0:
            percent_increase = 100.0 if completed_tasks_count > 0 else 0.0
        else:
            percent_increase = (
                (completed_tasks_count - last_month_completed_tasks_count)
                / last_month_total_tasks_count
            ) * 100

        return {
            "total": completion_rate,
            "percent_increase": percent_increase,
        }
