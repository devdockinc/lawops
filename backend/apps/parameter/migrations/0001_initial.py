# Generated by Django 4.2.11 on 2024-05-11 18:52

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Parameter",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "escavador_api_key",
                    models.TextField(blank=True, default=None, null=True),
                ),
            ],
            options={
                "verbose_name": "Parameter",
                "verbose_name_plural": "Parameters",
                "ordering": ["-id"],
            },
        ),
    ]
