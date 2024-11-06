from django.contrib.auth import get_user_model
from django.db import models


class AnnouncementManager(models.Manager): ...


class Announcement(models.Model):
    SEVERITY_CHOICES = (
        ("IN", "Information"),
        ("IM", "Important"),
        ("WA", "Warning"),
        ("CR", "Critical"),
    )

    id: int

    objects = AnnouncementManager()

    status = models.BooleanField(default=True)  # type: ignore
    severity = models.CharField(max_length=2, choices=SEVERITY_CHOICES, default="IN")

    title = models.CharField(max_length=512)
    content = models.TextField()

    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    notified = models.BooleanField(default=False)  # type: ignore
    send_mail = models.BooleanField(default=False)  # type: ignore

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.title)

    class Meta:
        verbose_name = "Announcement"
        verbose_name_plural = "Announcements"
        ordering = ["-id"]
