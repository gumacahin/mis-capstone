import factory
from django.contrib.auth import get_user_model
from faker import Faker

from upoutodo.api.models import Project, ProjectSection, Task

User = get_user_model()
fake = Faker()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    username = factory.LazyAttribute(lambda _: fake.user_name())
    email = factory.LazyAttribute(lambda _: fake.email())
    password = factory.PostGenerationMethodCall("set_password", "testpassword123")


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project
        skip_postgeneration_save = True

    title = factory.LazyAttribute(lambda _: " ".join(fake.words(3)))
    created_by = factory.SubFactory(UserFactory)
    updated_by = factory.SubFactory(UserFactory)


class ProjectSectionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProjectSection
        skip_postgeneration_save = True

    title = factory.LazyAttribute(lambda _: " ".join(fake.words(3)))
    project = factory.SubFactory(ProjectFactory)


class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task
        skip_postgeneration_save = True

    title = factory.LazyAttribute(lambda _: " ".join(fake.words(3)))
    description = factory.LazyAttribute(lambda _: fake.sentence())
    priority = factory.LazyAttribute(lambda _: fake.random_int(min=0, max=3))
    section = factory.SubFactory(ProjectSectionFactory)
