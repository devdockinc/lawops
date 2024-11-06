from django.db import models


class BillCategoryManager(models.Manager): ...


class BillCategory(models.Model):
    id: int

    objects = BillCategoryManager()

    active = models.BooleanField(default=True)  # type: ignore
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True, default=None)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = "Bill Category"
        verbose_name_plural = "Bill Categories"
        ordering = ["-id"]
