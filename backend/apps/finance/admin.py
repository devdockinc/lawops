from django.contrib import admin

from apps.finance import models


@admin.register(models.Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "description",
        "value",
        "due_date",
        "payment_date",
        "status",
    )

    list_filter = ("status",)

    search_fields = (
        "description",
        "value",
        "due_date",
        "payment_date",
        "status",
    )

    select_related = ("category",)


@admin.register(models.BillCategory)
class BillCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "active",
        "name",
    )

    search_fields = ("name",)
