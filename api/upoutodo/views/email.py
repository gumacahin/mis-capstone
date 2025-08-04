import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from upoutodo.email.send_email import send_email
from upoutodo.models.task import Task

User = get_user_model()
logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def daily_digest(request):
    """
    Send daily digest emails to all users.

    This endpoint will be triggered by Cloud Scheduler and will send daily digest
    emails to all users containing their tasks and other relevant information.
    """
    try:
        # Get all users
        users = User.objects.filter(is_active=True)

        emails_sent = 0
        errors = []

        for user in users:
            # Skip users without email addresses
            if not user.email:
                continue

            try:
                # Get user's tasks for today
                today = timezone.now().date()
                tasks_today = Task.objects.filter(
                    section__project__created_by=user,
                    due_date__date=today,
                    completion_date__isnull=True,
                ).select_related("section__project")

                # Get overdue tasks
                overdue_tasks = Task.objects.filter(
                    section__project__created_by=user,
                    due_date__lt=today,
                    completion_date__isnull=True,
                ).select_related("section__project")

                # Prepare template variables
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

                # Get user's name from profile if available
                recipient_name = None
                if hasattr(user, "profile") and user.profile.name:
                    recipient_name = user.profile.name
                elif user.first_name:
                    recipient_name = user.first_name
                elif user.username:
                    recipient_name = user.username

                # Send email
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

        # Log summary
        if errors:
            logger.warning(
                f"Daily digest completed with {len(errors)} errors. "
                f"{emails_sent} emails sent successfully."
            )

        return Response(status=status.HTTP_201_CREATED)

    except Exception as e:
        error_msg = f"Error processing daily digest: {str(e)}"
        logger.error(error_msg)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
