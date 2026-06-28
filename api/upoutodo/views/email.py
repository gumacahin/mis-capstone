import logging
from hmac import compare_digest

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from upoutodo.email.send_email import send_email
from upoutodo.models import Notification
from upoutodo.models.task import Task

User = get_user_model()
logger = logging.getLogger(__name__)
SCHEDULER_SECRET_HEADER = "X-Scheduler-Secret"


def _request_has_daily_digest_access(request):
    scheduler_secret = getattr(settings, "DAILY_DIGEST_SCHEDULER_SECRET", "")
    provided_secret = request.headers.get(SCHEDULER_SECRET_HEADER, "")
    if scheduler_secret and provided_secret:
        if compare_digest(str(scheduler_secret), str(provided_secret)):
            return True

    user = request.user
    if not user or not user.is_authenticated:
        return False

    return hasattr(user, "profile") and user.profile.is_admin


def _create_due_notifications(user, today):
    """Create in-app notifications for tasks due today and overdue tasks."""
    tasks_due_today = Task.objects.filter(
        section__project__created_by=user,
        due_date__date=today,
        completion_date__isnull=True,
    )
    for task in tasks_due_today:
        already_notified = Notification.objects.filter(
            user=user,
            type=Notification.Type.TASK_DUE,
            task=task,
            created_at__date=today,
        ).exists()
        if not already_notified:
            Notification.objects.create(
                user=user,
                type=Notification.Type.TASK_DUE,
                title=f'"{task.title}" is due today',
                task=task,
            )

    overdue_tasks = Task.objects.filter(
        section__project__created_by=user,
        due_date__date__lt=today,
        completion_date__isnull=True,
    )
    for task in overdue_tasks:
        already_notified = Notification.objects.filter(
            user=user,
            type=Notification.Type.TASK_OVERDUE,
            task=task,
            created_at__date=today,
        ).exists()
        if not already_notified:
            Notification.objects.create(
                user=user,
                type=Notification.Type.TASK_OVERDUE,
                title=f'"{task.title}" is overdue',
                task=task,
            )


@api_view(["POST"])
@permission_classes([AllowAny])
def daily_digest(request):
    """
    Send daily digest emails and in-app notifications to all users.

    Triggered by Cloud Scheduler. Creates task_due / task_overdue
    notifications and sends digest emails.
    """
    if not _request_has_daily_digest_access(request):
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        today = timezone.now().date()
        active_users = User.objects.filter(is_active=True)

        for user in active_users:
            _create_due_notifications(user, today)

        digest_users = active_users.filter(profile__email_digest_enabled=True)
        emails_sent = 0
        errors = []

        for user in digest_users:
            if not user.email:
                continue

            try:
                tasks_today = Task.objects.filter(
                    section__project__created_by=user,
                    due_date__date=today,
                    completion_date__isnull=True,
                ).select_related("section__project")

                overdue_tasks = Task.objects.filter(
                    section__project__created_by=user,
                    due_date__date__lt=today,
                    completion_date__isnull=True,
                ).select_related("section__project")

                template_vars = {
                    "tasks_today": [
                        {"name": task.title, "project": task.section.project.title}
                        for task in tasks_today
                    ],
                    "overdue_count": overdue_tasks.count(),
                    "app_url": getattr(
                        settings, "APP_URL", "https://upou-todo.web.app"
                    ),
                }

                recipient_name = None
                if hasattr(user, "profile") and user.profile.name:
                    recipient_name = user.profile.name
                elif user.first_name:
                    recipient_name = user.first_name
                elif user.username:
                    recipient_name = user.username

                send_email(
                    subject="Your Daily Digest",
                    recipient_email=user.email,
                    template_name="daily_digest.html",
                    template_vars=template_vars,
                    recipient_name=recipient_name,
                )

                emails_sent += 1

            except Exception as e:
                error_msg = f"Error sending email to {user.email}: {str(e)}"
                errors.append(error_msg)
                logger.error(error_msg)

        if errors:
            logger.warning(
                f"Daily digest completed with {len(errors)} errors. "
                f"{emails_sent} emails sent successfully."
            )

        return Response(status=status.HTTP_201_CREATED)

    except Exception:
        logger.exception("Error processing daily digest")
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
