from rest_framework import serializers

from apps.escavador.models.fontes import ProcessoFonteEscavador
from apps.escavador.serializers.capa import (
    ProcessoFonteCapaEscavadorSerializer,
    TribunalEscavadorSerializer,
)


class ProcessoFonteEscadorSerializer(serializers.ModelSerializer):
    capa_details = ProcessoFonteCapaEscavadorSerializer(source="capa", read_only=True)
    tribunal_details = TribunalEscavadorSerializer(source="tribunal", read_only=True)

    class Meta:
        model = ProcessoFonteEscavador
        fields = (
            "id",
            "processo",
            "id_escavador",
            "processo_fonte_id",
            "descricao",
            "nome",
            "sigla",
            "tipo",
            "data_inicio",
            "data_ultima_movimentacao",
            "segredo_justica",
            "arquivado",
            "status_predito",
            "grau",
            "grau_formatado",
            "fisico",
            "sistema",
            "url",
            "quantidade_movimentacoes",
            "data_ultima_verificacao",
            "capa",
            "capa_details",
            "tribunal",
            "tribunal_details",
            "caderno",
        )
