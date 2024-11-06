from django.contrib.auth import get_user_model
from django.db import models


class RecipientManager(models.Manager):
    def get_active_recipients(self):
        return self.get_queryset().filter(active=True).select_related("user")


class Recipient(models.Model):
    id: int
    objects = RecipientManager()

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    active = models.BooleanField(default=True)  # type: ignore
    number = models.CharField(max_length=13)

    def __str__(self):
        return f"{self.user} - {self.number}"

    class Meta:
        verbose_name = "Recipient"
        verbose_name_plural = "Recipients"
        ordering = ["-id"]


class NotificationManager(models.Manager): ...


class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = (
        ("WPP", "WhatsApp"),
        ("EML", "E-mail"),
    )

    id: int
    objects = NotificationManager()

    active = models.BooleanField(default=True)  # type: ignore
    notification_type = models.CharField(
        max_length=3, choices=NOTIFICATION_TYPE_CHOICES, default="WPP"
    )
    title = models.CharField(max_length=255)
    message = models.TextField()

    author = models.ForeignKey(
        get_user_model(), on_delete=models.SET_NULL, null=True, blank=True, default=None
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.notification_type}] {str(self.title)[:50]}"

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ["-id"]


class NotificationHistoryManager(models.Manager): ...


class NotificationHistory(models.Model):
    id: int
    objects = NotificationHistoryManager()

    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    recipient = models.ForeignKey(Recipient, on_delete=models.CASCADE)

    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.notification} - {self.recipient}"

    class Meta:
        verbose_name = "Notification History"
        verbose_name_plural = "Notification Histories"
        ordering = ["-id"]
