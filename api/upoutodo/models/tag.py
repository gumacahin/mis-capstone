from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify
from taggit.models import GenericTaggedItemBase, TagBase

User = get_user_model()


class Tag(TagBase):
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_tags",
    )

    class Meta:
        unique_together = (
            "name",
            "created_by",
        )

    def save(self, *args, **kwargs):
        # Update the slug whenever the name changes
        if not self.slug or self.name != self.__class__.objects.get(pk=self.pk).name:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class TaggedItem(GenericTaggedItemBase):
    tag = models.ForeignKey(
        Tag,
        on_delete=models.CASCADE,
        related_name="tagged_items",
    )
