from rest_framework import serializers

from apps.lawsuit import models
from apps.authentication import serializers as auth_serializers


class LawsuitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lawsuit
        fields = (
            "id",
            "cnj_number",
            "observation",
            "automatic_update",
            "update_interval",
            "monitoring_id",
            "last_check",
            "created_by",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class LawsuitCommentSerializer(serializers.ModelSerializer):
    created_by = auth_serializers.UserSerializer(read_only=True)

    class Meta:
        model = models.LawsuitComment
        fields = (
            "id",
            "lawsuit",
            "comment",
            "created_by",
            "created_at",
        )

        read_only_fields = (
            "id",
            "created_at",
        )
