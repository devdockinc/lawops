from rest_framework import serializers

from apps.announcement import models
from apps.authentication import serializers as auth_serializers


class AnnouncementSerializer(serializers.ModelSerializer):
    author = auth_serializers.UserSerializer(read_only=True)

    class Meta:
        model = models.Announcement
        fields = (
            "id",
            "status",
            "title",
            "content",
            "severity",
            "author",
            "send_mail",
            "notified",
            "created_at",
            "updated_at",
        )
