# Generated manually for timezone field

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("upoutodo", "0012_add_timezone_field"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="timezone",
            field=models.CharField(
                max_length=50,
                default="Asia/Manila",
                help_text="User's timezone (e.g., Asia/Manila, America/New_York)",
            ),
        ),
    ]
