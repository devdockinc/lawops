from django.apps import AppConfig


class AnnouncementConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"  # type: ignore
    name = "apps.announcement"