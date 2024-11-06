from django.contrib import admin

from apps.lawsuit import models


@admin.register(models.Lawsuit)
class LawsuitAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cnj_number",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "cnj_number",
        "description",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25


@admin.register(models.LawsuitComment)
class LawsuitCommentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "lawsuit",
        "comment",
        "created_at",
    )

    search_fields = (
        "lawsuit",
        "comment",
    )

    list_filter = (
        "created_by",
        "created_at",
    )

    list_per_page = 25

    list_select_related = ("lawsuit",)
