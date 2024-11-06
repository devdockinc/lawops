from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.authentication.permissions import CustomDjangoModelPermissions
from apps.notification import models, serializers


class RecipientViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]

    queryset = models.Recipient.objects.all()
    serializer_class = serializers.RecipientSerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]

    filterset_fields = ("active",)


class NotificationViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]

    queryset = models.Notification.objects.all()
    serializer_class = serializers.NotificationSerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]

    filterset_fields = (
        "active",
        "notification_type",
    )


class NotificationHistoryViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]

    queryset = models.NotificationHistory.objects.all()
    serializer_class = serializers.NotificationHistorySerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]

    filterset_fields = (
        "notification",
        "recipient",
    )
