# Generated manually for RRULE migration

from django.db import migrations


def migrate_due_date_to_rrule(apps, schema_editor):
    Task = apps.get_model("upoutodo", "Task")

    for task in Task.objects.filter(rrule__isnull=True):
        if task.due_date:
            # Convert existing due_date to RRULE with COUNT=1
            # Format: DTSTART:20240101T090000Z;RRULE:FREQ=DAILY;COUNT=1
            rrule_string = f"DTSTART:{task.due_date.strftime('%Y%m%dT%H%M%SZ')};RRULE:FREQ=DAILY;COUNT=1"
            task.rrule = rrule_string
            task.save(update_fields=["rrule"])
        else:
            # No due_date, create a placeholder RRULE for future use
            # This won't generate any occurrences until user sets a due date
            task.rrule = "DTSTART:20240101T000000Z;RRULE:FREQ=DAILY;COUNT=1"
            task.save(update_fields=["rrule"])


def reverse_migrate_rrule_to_due_date(apps, schema_editor):
    Task = apps.get_model("upoutodo", "Task")

    for task in Task.objects.filter(rrule__isnull=False):
        try:
            from dateutil import rrule

            rule = rrule.rrulestr(task.rrule)
            # Extract DTSTART from RRULE
            if hasattr(rule, "_dtstart") and rule._dtstart:
                task.due_date = rule._dtstart
                task.save(update_fields=["due_date"])
        except Exception:
            # If parsing fails, keep existing due_date
            pass


class Migration(migrations.Migration):
    dependencies = [
        ("upoutodo", "0008_add_rrule_field"),
    ]

    operations = [
        migrations.RunPython(
            migrate_due_date_to_rrule,
            reverse_migrate_rrule_to_due_date,
        ),
    ]
