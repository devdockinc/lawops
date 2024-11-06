# Generated by Django 4.2.11 on 2024-05-11 18:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("lawsuit", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="BillCategory",
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
                ("active", models.BooleanField(default=True)),
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True, default=None, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Bill Category",
                "verbose_name_plural": "Bill Categories",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="Bill",
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
                    "bill_type",
                    models.CharField(
                        choices=[("IN", "In"), ("OUT", "Out")], max_length=3
                    ),
                ),
                ("active", models.BooleanField(default=True)),
                (
                    "status",
                    models.CharField(
                        choices=[("PE", "Pending"), ("PA", "Paid"), ("CA", "Canceled")],
                        default="PE",
                        max_length=2,
                    ),
                ),
                ("description", models.CharField(max_length=512)),
                ("observation", models.TextField(blank=True, default=None, null=True)),
                ("value", models.DecimalField(decimal_places=2, max_digits=25)),
                ("due_date", models.DateField(blank=True, default=None, null=True)),
                ("payment_date", models.DateField(blank=True, default=None, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "category",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="bill_category",
                        to="finance.billcategory",
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "lawsuit",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="bill_lawsuit",
                        to="lawsuit.lawsuit",
                    ),
                ),
            ],
            options={
                "verbose_name": "Bill",
                "verbose_name_plural": "Bills",
                "ordering": ["-id"],
            },
        ),
    ]