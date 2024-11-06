from django.contrib import admin
from apps.announcement import models


@admin.register(models.Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "status",
        "severity",
        "title",
        "author",
        "created_at",
    )
