from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from apps.announcement import serializers
from apps.announcement import models
from rest_framework.permissions import IsAuthenticated
from apps.authentication.permissions import CustomDjangoModelPermissions
from apps.announcement import filters
from apps.notification.models import Recipient
from utils.mail import send_html_mail


class AnnouncementViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]

    queryset = models.Announcement.objects.all()
    serializer_class = serializers.AnnouncementSerializer

    permission_classes = [
        IsAuthenticated,
        CustomDjangoModelPermissions,
    ]

    filterset_class = filters.AnnouncementFilter

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=False, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)

        if serializer.data.get("send_mail"):
            recipients_mail = (
                Recipient.objects.get_active_recipients()
                .exclude(user__email="")
                .values_list("user__email", flat=True)
            )
            send_html_mail(
                subject=serializer.data.get("title"),
                html_content=serializer.data.get("content"),
                plain_text_content=serializer.data.get("content"),
                recipient_list=recipients_mail,
            )

        return Response(serializer.data)
