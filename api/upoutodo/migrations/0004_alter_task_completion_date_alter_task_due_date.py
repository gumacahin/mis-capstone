# Generated by Django 5.1.7 on 2025-05-12 06:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("upoutodo", "0003_tag_taggeditem_alter_task_tags"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="completion_date",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="task",
            name="due_date",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
