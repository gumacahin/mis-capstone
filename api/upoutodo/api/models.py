from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from todo.models import User


# FIXME: This is not working. I attempted to add a user profile model but
# failed.
# Revisiting this: Attempted? How?
class UserProfile(models.Model):
    name = models.TextField(
        null=True,
        blank=True,
        help_text="Editable user name  that defaults to a user's Google/Auth0 name",
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_admin = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    is_deactivated = models.BooleanField(default=False)

    def __str__(self):
        return f"Username: {self.user.email}"

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            UserProfile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, created, **kwargs):
        pass
        # email = instance.email
        # if email and created:
        #     date_joined = instance.date_joined

        # TODO: send email to user
        # send_email(
        #     "User Signup",
        #     email,
        #     "new_user_signup",
        #     {
        #         "email": email,
        #         "signup_date": date_joined,
        #     },
        # )
