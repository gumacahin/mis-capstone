from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Notification(models.Model):
    class Type(models.TextChoices):
        TASK_DUE = "task_due", "Task Due"
        TASK_OVERDUE = "task_overdue", "Task Overdue"
        COMMENT = "comment", "New Comment"
        SYSTEM = "system", "System"

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.SYSTEM)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    task = models.ForeignKey(
        "upoutodo.Task", on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.type}: {self.title}"
