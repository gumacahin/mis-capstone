from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_comments.models import Comment

from upoutodo.models import Notification, Project, ProjectSection, Task, UserProfile


@receiver(post_save, sender=User)
def setup_user_inbox(sender, instance, created, **kwargs):
    """The default project is the user's inbox."""
    if created:
        Project.objects.create(
            title=Project.DEFAULT_PROJECT_TITLE,
            is_default=True,
            created_by=instance,
            updated_by=instance,
        )


@receiver(post_save, sender=User)
def setup_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def send_welcome_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance,
            type=Notification.Type.SYSTEM,
            title="Welcome to UPOU Todo!",
            message="Start by adding your first task in the Inbox.",
        )


@receiver(post_save, sender=Project)
def setup_default_project_section(sender, instance, created, **kwargs):
    if created:
        ProjectSection.objects.create(
            title=Project.DEFAULT_PROJECT_SECTION_TITLE,
            project=instance,
            is_default=True,
        )


@receiver(post_save, sender=Comment)
def notify_task_owner_on_comment(sender, instance, created, **kwargs):
    """Notify the task owner when a new comment is posted on their task."""
    if not created:
        return

    task_ct = ContentType.objects.get_for_model(Task)
    if instance.content_type_id != task_ct.id:
        return

    try:
        task = Task.objects.select_related("section__project").get(
            pk=instance.object_pk
        )
    except Task.DoesNotExist:
        return

    task_owner = task.section.project.created_by
    if task_owner == instance.user:
        return

    Notification.objects.create(
        user=task_owner,
        type=Notification.Type.COMMENT,
        title=f'New comment on "{task.title}"',
        message=instance.comment[:120],
        task=task,
    )
