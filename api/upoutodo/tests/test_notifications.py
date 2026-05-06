import pytest
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.sites.models import Site
from django.urls import reverse
from django.utils import timezone
from django_comments.models import Comment
from rest_framework.test import APIClient

from upoutodo.models import Notification, Task
from upoutodo.tests.factories import (
    ProjectFactory,
    ProjectSectionFactory,
    TaskFactory,
    UserFactory,
)

User = get_user_model()


@pytest.mark.django_db
class TestWelcomeNotification:
    def test_new_user_receives_welcome_notification(self):
        user = User.objects.create_user(username="newuser", password="pass")
        notif = Notification.objects.get(user=user, type=Notification.Type.SYSTEM)
        assert "Welcome" in notif.title

    def test_welcome_notification_created_only_once(self):
        user = User.objects.create_user(username="newuser", password="pass")
        user.first_name = "Updated"
        user.save()
        assert (
            Notification.objects.filter(
                user=user, type=Notification.Type.SYSTEM
            ).count()
            == 1
        )


@pytest.mark.django_db
class TestCommentNotification:
    @pytest.fixture()
    def task_owner(self):
        return UserFactory()

    @pytest.fixture()
    def commenter(self):
        return UserFactory()

    @pytest.fixture()
    def task(self, task_owner):
        project = ProjectFactory(created_by=task_owner, updated_by=task_owner)
        section = ProjectSectionFactory(project=project)
        return TaskFactory(section=section)

    def _create_comment(self, task, user, text="Great work!"):
        site = Site.objects.get_current()
        ct = ContentType.objects.get_for_model(Task)
        return Comment.objects.create(
            content_type=ct,
            object_pk=str(task.pk),
            site=site,
            user=user,
            comment=text,
        )

    def test_task_owner_notified_on_comment(self, task, task_owner, commenter):
        self._create_comment(task, commenter)
        assert Notification.objects.filter(
            user=task_owner,
            type=Notification.Type.COMMENT,
            task=task,
        ).exists()

    def test_notification_contains_comment_snippet(self, task, task_owner, commenter):
        self._create_comment(task, commenter, text="Looks good to me")
        notif = Notification.objects.get(
            user=task_owner, type=Notification.Type.COMMENT
        )
        assert "Looks good to me" in notif.message

    def test_no_self_notification(self, task, task_owner):
        self._create_comment(task, task_owner)
        assert not Notification.objects.filter(
            user=task_owner, type=Notification.Type.COMMENT
        ).exists()


@pytest.mark.django_db
class TestDailyDigestNotifications:
    @pytest.fixture()
    def user(self):
        return UserFactory(email="test@example.com")

    @pytest.fixture()
    def section(self, user):
        project = ProjectFactory(created_by=user, updated_by=user)
        return ProjectSectionFactory(project=project)

    def test_due_today_creates_notification(self, user, section):
        now = timezone.now()
        TaskFactory(section=section, due_date=now, completion_date=None)

        client = APIClient()
        url = reverse("daily-digest")
        client.post(url, format="json")

        assert (
            Notification.objects.filter(
                user=user, type=Notification.Type.TASK_DUE
            ).count()
            == 1
        )

    def test_overdue_creates_notification(self, user, section):
        yesterday = timezone.now() - timezone.timedelta(days=1)
        TaskFactory(section=section, due_date=yesterday, completion_date=None)

        client = APIClient()
        url = reverse("daily-digest")
        client.post(url, format="json")

        assert (
            Notification.objects.filter(
                user=user, type=Notification.Type.TASK_OVERDUE
            ).count()
            == 1
        )

    def test_no_duplicate_notifications_on_rerun(self, user, section):
        now = timezone.now()
        TaskFactory(section=section, due_date=now, completion_date=None)

        client = APIClient()
        url = reverse("daily-digest")
        client.post(url, format="json")
        client.post(url, format="json")

        assert (
            Notification.objects.filter(
                user=user, type=Notification.Type.TASK_DUE
            ).count()
            == 1
        )

    def test_completed_tasks_skipped(self, user, section):
        now = timezone.now()
        TaskFactory(section=section, due_date=now, completion_date=now)

        client = APIClient()
        url = reverse("daily-digest")
        client.post(url, format="json")

        assert not Notification.objects.filter(
            user=user, type=Notification.Type.TASK_DUE
        ).exists()


@pytest.mark.django_db
class TestNotificationViewSet:
    @pytest.fixture()
    def user(self):
        return UserFactory()

    @pytest.fixture()
    def auth_client(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        return client

    def test_list_own_notifications(self, auth_client, user):
        Notification.objects.create(
            user=user, type=Notification.Type.SYSTEM, title="Hello"
        )
        other = UserFactory()
        Notification.objects.create(
            user=other, type=Notification.Type.SYSTEM, title="Other"
        )

        resp = auth_client.get("/api/notifications/")
        assert resp.status_code == 200
        results = resp.data.get("results", resp.data)
        own_titles = {n["title"] for n in results}
        assert "Hello" in own_titles
        assert "Other" not in own_titles

    def test_mark_read(self, auth_client, user):
        notif = Notification.objects.create(
            user=user, type=Notification.Type.SYSTEM, title="Test"
        )
        resp = auth_client.post(f"/api/notifications/{notif.id}/read/")
        assert resp.status_code == 200
        notif.refresh_from_db()
        assert notif.is_read is True

    def test_mark_all_read(self, auth_client, user):
        Notification.objects.create(user=user, type=Notification.Type.SYSTEM, title="A")
        Notification.objects.create(user=user, type=Notification.Type.SYSTEM, title="B")

        resp = auth_client.post("/api/notifications/read_all/")
        assert resp.status_code == 204
        assert Notification.objects.filter(user=user, is_read=False).count() == 0

    def test_unread_count(self, auth_client, user):
        # Mark existing notifications (e.g. welcome) as read first
        Notification.objects.filter(user=user).update(is_read=True)

        Notification.objects.create(user=user, type=Notification.Type.SYSTEM, title="A")
        Notification.objects.create(
            user=user, type=Notification.Type.SYSTEM, title="B", is_read=True
        )

        resp = auth_client.get("/api/notifications/unread_count/")
        assert resp.status_code == 200
        assert resp.data["count"] == 1

    def test_create_blocked(self, auth_client):
        resp = auth_client.post(
            "/api/notifications/",
            {"type": "system", "title": "Hacked"},
            format="json",
        )
        assert resp.status_code == 405
