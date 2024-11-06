from django.contrib.auth import get_user_model
from django.db import models

from apps.finance.models.category import BillCategory
from apps.lawsuit.models import Lawsuit


class BillManager(models.Manager):
    def get_queryset(self):
        return (
            super().get_queryset().select_related("category", "lawsuit", "created_by")
        )


class Bill(models.Model):
    TYPE_CHOICES = (
        ("IN", "In"),
        ("OUT", "Out"),
    )

    STATUS_CHOICES = (
        ("PE", "Pending"),
        ("PA", "Paid"),
        ("CA", "Canceled"),
    )

    id: int

    objects = BillManager()
    bill_type = models.CharField(max_length=3, choices=TYPE_CHOICES)

    category = models.ForeignKey(
        BillCategory,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        default=None,
        related_name="bill_category",
    )

    active = models.BooleanField(default=True)  # type: ignore
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default="PE")
    description = models.CharField(max_length=512)
    observation = models.TextField(null=True, blank=True, default=None)
    value = models.DecimalField(max_digits=25, decimal_places=2)
    due_date = models.DateField(null=True, blank=True, default=None)
    payment_date = models.DateField(null=True, blank=True, default=None)

    created_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.PROTECT,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    lawsuit = models.ForeignKey(
        Lawsuit,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="bill_lawsuit",
    )

    def __str__(self):
        return str(self.description)

    class Meta:
        verbose_name = "Bill"
        verbose_name_plural = "Bills"
        ordering = ["-id"]
