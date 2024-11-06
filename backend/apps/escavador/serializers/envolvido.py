from rest_framework import serializers

from apps.escavador.models.envolvido import (
    EnvolvidoEscavador,
    EnvolvidosProcessoFonteEscavador,
    OabEnvolvido,
    OabEscavador,
)


class EnvolvidoEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvolvidoEscavador
        fields = (
            "id",
            "processo",
            "id_escavador",
            "nome",
            "quantidade_processos",
            "tipo_pessoa",
            "prefixo",
            "sufixo",
            "tipo",
            "tipo_normalizado",
            "polo",
            "cpf",
            "cnpj",
        )


class OabEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = OabEscavador
        fields = ("id", "numero", "uf", "tipo")


class OabEnvolvidoSerializer(serializers.ModelSerializer):
    envolvido = EnvolvidoEscavadorSerializer(read_only=True)

    class Meta:
        model = OabEnvolvido
        fields = ("id", "envolvido", "oab")


class EnvolvidosProcessoFonteEscavadorSerializer(serializers.ModelSerializer):
    envolvido = EnvolvidoEscavadorSerializer(read_only=True)

    class Meta:
        model = EnvolvidosProcessoFonteEscavador
        fields = ("id", "envolvido", "processo_fonte")
