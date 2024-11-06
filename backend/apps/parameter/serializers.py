from rest_framework import serializers

from apps.parameter.models import Parameter


class ParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        fields = (
            "id",
            "escavador_api_key",
        )
