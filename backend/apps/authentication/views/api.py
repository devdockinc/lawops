from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.authentication.permissions import CustomDjangoModelPermissions
from apps.authentication.serializers import UserSerializer
from apps.authentication.filters import UserFilter


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all().order_by("-id")

    serializer_class = UserSerializer

    permission_classes = [
        IsAuthenticated,
        CustomDjangoModelPermissions,
    ]

    filterset_class = UserFilter
