from django.contrib import admin

from apps.notification import models


@admin.register(models.Recipient)
class RecipientAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "active",
        "number",
    ]

    list_filter = [
        "active",
    ]

    list_select_related = [
        "user",
    ]


@admin.register(models.Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "active",
        "title",
        "notification_type",
        "created_at",
    ]

    list_filter = [
        "active",
        "notification_type",
    ]

    list_select_related = [
        "author",
    ]


@admin.register(models.NotificationHistory)
class NotificationHistoryAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "notification",
        "recipient",
        "sent_at",
    ]

    list_filter = [
        "notification",
        "recipient",
    ]

    list_select_related = [
        "notification",
        "recipient",
    ]
