from django.contrib.auth import get_user_model
from django.db import models


class LawsuitManager(models.Manager): ...


class Lawsuit(models.Model):
    UPDATE_INTERVAL_CHOICES = (
        ("NA", "N/A"),
        ("DA", "Daily"),
        ("AL", "Alternate Days"),
        ("WE", "Weekly"),
        ("MO", "Monthly"),
    )

    id: int
    objects = LawsuitManager()

    cnj_number = models.CharField(max_length=50, unique=True)

    automatic_update = models.BooleanField(default=False)  # type: ignore
    update_interval = models.CharField(
        max_length=2, choices=UPDATE_INTERVAL_CHOICES, default="NA"
    )
    monitoring_id = models.PositiveBigIntegerField(null=True, blank=True)
    last_check = models.DateTimeField(null=True, blank=True)

    observation = models.TextField(null=True, blank=True)

    created_by = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.cnj_number)

    class Meta:
        verbose_name = "Lawsuit"
        verbose_name_plural = "Lawsuits"
        ordering = ["-id"]


class LawsuitCommentManager(models.Manager): ...


class LawsuitComment(models.Model):
    id: int
    objects = LawsuitCommentManager()

    lawsuit = models.ForeignKey(Lawsuit, on_delete=models.CASCADE)
    comment = models.TextField()
    created_by = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.comment)

    class Meta:
        verbose_name = "Lawsuit Comment"
        verbose_name_plural = "Lawsuit Comments"
        ordering = ["-id"]
