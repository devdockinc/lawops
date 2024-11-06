from django.db import models


class Parameter(models.Model):
    id: int
    escavador_api_key = models.TextField(null=True, blank=True, default=None)

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = "Parameter"
        verbose_name_plural = "Parameters"
        ordering = ["-id"]
