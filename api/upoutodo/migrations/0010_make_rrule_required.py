# Generated manually for RRULE migration

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("upoutodo", "0009_migrate_due_date_to_rrule"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="rrule",
            field=models.TextField(help_text="RRULE string for recurring tasks"),
        ),
    ]
