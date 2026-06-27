import pytest
from django.contrib.contenttypes.models import ContentType
from django.contrib.sites.models import Site
from django.urls import reverse
from django_comments.models import Comment
from rest_framework import status
from rest_framework.test import APIClient

from upoutodo.models import Task
from upoutodo.tests.factories import ProjectFactory, TaskFactory, UserFactory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def task(user):
    project = ProjectFactory(created_by=user, updated_by=user)
    return TaskFactory(section=project.sections.first())


def create_comment(task, user, text):
    return Comment.objects.create(
        content_type=ContentType.objects.get_for_model(Task),
        object_pk=str(task.pk),
        site=Site.objects.get_current(),
        user=user,
        comment=text,
    )


@pytest.mark.django_db
def test_comment_list_only_includes_owned_task_comments(auth_client, user, task):
    own_comment = create_comment(task, user, "owned comment")
    other_user = UserFactory()
    other_project = ProjectFactory(created_by=other_user, updated_by=other_user)
    other_task = TaskFactory(section=other_project.sections.first())
    foreign_comment = create_comment(other_task, other_user, "foreign comment")

    response = auth_client.get(reverse("comment-list"), format="json")

    assert response.status_code == status.HTTP_200_OK
    results = response.data["results"]
    comment_ids = {comment["id"] for comment in results}
    assert own_comment.id in comment_ids
    assert foreign_comment.id not in comment_ids


@pytest.mark.django_db
def test_comment_create_accepts_owned_task(auth_client, user, task):
    response = auth_client.post(
        reverse("comment-list"),
        {"object_pk": str(task.pk), "comment": "new comment"},
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    comment = Comment.objects.get(id=response.data["id"])
    assert comment.user == user
    assert comment.object_pk == str(task.pk)


@pytest.mark.django_db
def test_comment_create_rejects_foreign_task(auth_client):
    other_user = UserFactory()
    other_project = ProjectFactory(created_by=other_user, updated_by=other_user)
    other_task = TaskFactory(section=other_project.sections.first())

    response = auth_client.post(
        reverse("comment-list"),
        {"object_pk": str(other_task.pk), "comment": "not allowed"},
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "object_pk" in response.data
    assert not Comment.objects.filter(
        object_pk=str(other_task.pk), comment="not allowed"
    ).exists()
