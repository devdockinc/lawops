from rest_framework import serializers

from apps.escavador.models.movimentacao import (
    MovimentacaoEscavador,
)


class MovimentacaoEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimentacaoEscavador
        fields = (
            "id",
            "processo",
            "id_escavador",
            "data",
            "tipo",
            "conteudo",
            "fonte_id",
            "fonte_nome",
            "fonte_tipo",
            "fonte_sigla",
            "fonte_grau",
            "fonte_grau_formatado",
            "fonte_caderno",
        )
