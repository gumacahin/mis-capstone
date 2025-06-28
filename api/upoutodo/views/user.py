from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from upoutodo.serializers import UserSerializer

User = get_user_model()

LAST_SEEN_UPDATE_INTERVAL = 5


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=["GET"], detail=False)
    def me(self, request):
        serializer = UserSerializer(request.user)
        if request.user.is_authenticated:
            now = timezone.now()
            last_seen = request.user.last_login
            if not last_seen or (now - last_seen) > timedelta(
                minutes=LAST_SEEN_UPDATE_INTERVAL
            ):
                request.user.last_login = now
                request.user.save(update_fields=["last_login"])
        return Response(serializer.data)
