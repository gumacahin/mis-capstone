# signals.py
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from upoutodo.models import Project, ProjectSection, UserProfile


@receiver(post_save, sender=User)
def setup_user_inbox(sender, instance, created, **kwargs):
    """The default project is the user's inbox."""
    if created:
        username = instance.username
        Project.objects.create(
            title=username, is_default=True, created_by=instance, updated_by=instance
        )


@receiver(post_save, sender=User)
def setup_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        # TODO: send email


@receiver(post_save, sender=Project)
def setup_default_project_section(sender, instance, created, **kwargs):
    if created:
        ProjectSection.objects.create(
            title=Project.DEFAULT_PROJECT_SECTION_TITLE,
            project=instance,
            is_default=True,
        )
