# signals.py
from django.contrib.auth.models import Group, User
from django.db.models.signals import post_save
from django.dispatch import receiver
from todo.models import TaskList


@receiver(post_save, sender=User)
def create_user_group(sender, instance, created, **kwargs):
    if created:
        group_name = instance.username
        group = Group.objects.create(name=group_name)
        instance.groups.add(group)
        TaskList.objects.create(name="Inbox", slug="inbox", group=group)
