from rest_framework import serializers

from apps.notification import models


class RecipientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = models.Recipient
        fields = (
            "id",
            "user",
            "username",
            "first_name",
            "last_name",
            "active",
            "number",
        )


class NotificationSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_first_name = serializers.CharField(
        source="author.first_name", read_only=True
    )
    author_last_name = serializers.CharField(source="author.last_name", read_only=True)

    class Meta:
        model = models.Notification
        fields = (
            "id",
            "active",
            "notification_type",
            "title",
            "message",
            "author",
            "author_username",
            "author_first_name",
            "author_last_name",
            "created_at",
        )


class NotificationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.NotificationHistory
        fields = (
            "id",
            "notification",
            "recipient",
            "sent_at",
        )
