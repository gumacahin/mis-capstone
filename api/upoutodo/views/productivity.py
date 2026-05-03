from datetime import timedelta

from django.db.models import Avg, DurationField, ExpressionWrapper, F
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from upoutodo.models import Task


class UserProductivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get_user_tasks(self, request):
        return Task.objects.filter(section__project__created_by=request.user)

    def get(self, request):
        return Response(
            {
                "summary": self.summary(request),
                "weekly_trends": self.weekly_trends(request),
                "priority_distribution": self.priority_distribution(request),
                "streak": self.completion_streak(request),
            }
        )

    def summary(self, request):
        qs = self.get_user_tasks(request)
        now = timezone.now()
        today = now.date()
        total = qs.count()
        completed = qs.filter(completion_date__isnull=False).count()
        pending = qs.filter(completion_date__isnull=True).count()
        overdue = qs.filter(due_date__lt=now, completion_date__isnull=True).count()
        due_today = qs.filter(
            due_date__date=today, completion_date__isnull=True
        ).count()

        seven_days_ago = now - timedelta(days=7)
        completed_this_week = qs.filter(completion_date__gte=seven_days_ago).count()
        created_this_week = qs.filter(created_at__gte=seven_days_ago).count()

        completion_rate = round((completed / total) * 100, 1) if total > 0 else 0

        avg_completion_time = (
            qs.filter(completion_date__isnull=False)
            .annotate(
                duration=ExpressionWrapper(
                    F("completion_date") - F("created_at"),
                    output_field=DurationField(),
                )
            )
            .aggregate(avg=Avg("duration"))["avg"]
        )
        avg_days = (
            round(avg_completion_time.total_seconds() / 86400, 1)
            if avg_completion_time
            else None
        )

        return {
            "total": total,
            "completed": completed,
            "pending": pending,
            "overdue": overdue,
            "due_today": due_today,
            "completed_this_week": completed_this_week,
            "created_this_week": created_this_week,
            "completion_rate": completion_rate,
            "avg_completion_days": avg_days,
        }

    def weekly_trends(self, request):
        qs = self.get_user_tasks(request)
        today = timezone.now().date()
        trends = []
        for i in range(27, -1, -1):
            day = today - timedelta(days=i)
            created = qs.filter(created_at__date=day).count()
            completed = qs.filter(completion_date__date=day).count()
            trends.append(
                {
                    "date": day.isoformat(),
                    "day": day.strftime("%a"),
                    "created": created,
                    "completed": completed,
                }
            )
        return trends

    def priority_distribution(self, request):
        qs = self.get_user_tasks(request)
        total = qs.count()
        result = []
        for priority in Task.Priority:
            count = qs.filter(priority=priority).count()
            completed = qs.filter(
                priority=priority, completion_date__isnull=False
            ).count()
            completion_rate = round((completed / count) * 100, 1) if count > 0 else 0
            result.append(
                {
                    "priority": priority.value,
                    "label": priority.label,
                    "count": count,
                    "percent": round((count / total) * 100, 1) if total > 0 else 0,
                    "completion_rate": completion_rate,
                }
            )
        return result

    def completion_streak(self, request):
        """Count consecutive days (ending today) with at least one task completed."""
        qs = self.get_user_tasks(request).filter(completion_date__isnull=False)
        today = timezone.now().date()
        streak = 0
        for i in range(365):
            day = today - timedelta(days=i)
            if qs.filter(completion_date__date=day).exists():
                streak += 1
            else:
                break
        return {"current": streak}
