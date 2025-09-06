# Generated manually for RRULE migration

from datetime import timedelta

from dateutil import rrule
from django.db import migrations
from django.utils import timezone


def populate_due_date_cache(apps, schema_editor):
    Task = apps.get_model("upoutodo", "Task")

    for task in Task.objects.all():
        if task.rrule:
            try:
                rule = rrule.rrulestr(task.rrule)
                now = timezone.now()
                # Get next occurrence within next year
                occurrences = list(
                    rule.between(now, now + timedelta(days=365), inc=True)
                )
                task.due_date = occurrences[0] if occurrences else None
                task.save(update_fields=["due_date"])
            except Exception:
                # If parsing fails, keep existing due_date
                pass


def reverse_populate_due_date_cache(apps, schema_editor):
    # No need to reverse this - due_date is just a cache
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("upoutodo", "0010_make_rrule_required"),
    ]

    operations = [
        migrations.RunPython(
            populate_due_date_cache,
            reverse_populate_due_date_cache,
        ),
    ]
