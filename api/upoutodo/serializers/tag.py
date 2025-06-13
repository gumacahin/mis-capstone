from rest_framework import serializers

from upoutodo.models import Tag, Task

from .task import TaskSerializer


class TagAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "created_by"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name"]

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["created_by"] = request.user
        return super().create(validated_data)


class TagDetailSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    def get_tasks(self, obj):
        return TaskSerializer(
            Task.objects.filter(
                tags__slug=obj.slug, section__project__created_by=obj.created_by
            ),
            many=True,
        ).data

    class Meta:
        model = Tag
        fields = ["id", "name", "tasks", "created_by"]
