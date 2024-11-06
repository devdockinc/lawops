from rest_framework import serializers

from apps.escavador.models.capa import (
    AssuntoNormalizadoEscavador,
    AssuntoNormalizadoProcessoFonteCapaEscavador,
    EstadosEscavador,
    InformacaoComplementarEscavador,
    InformacaoComplementarProcessoFonteCapaEscavador,
    ProcessoFonteCapaEscavador,
    TribunalEscavador,
    TribunalEstadosEscavador,
    ValorCausaEscavador,
)


class ValorCausaEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValorCausaEscavador
        fields = (
            "id",
            "valor",
            "moeda",
            "valor_formatado",
        )


class AssuntoNormalizadoEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssuntoNormalizadoEscavador
        fields = (
            "id",
            "id_escavador",
            "nome",
            "nome_com_pai",
            "path_completo",
        )


class InformacaoComplementarEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformacaoComplementarEscavador
        fields = (
            "id",
            "tipo",
            "valor",
        )


class ProcessoFonteCapaEscavadorSerializer(serializers.ModelSerializer):
    valor_details = ValorCausaEscavadorSerializer(
        read_only=True, required=False, source="valor"
    )

    assunto_principal_normalizado_details = AssuntoNormalizadoEscavadorSerializer(
        read_only=True, required=False, source="assunto_principal_normalizado"
    )

    class Meta:
        model = ProcessoFonteCapaEscavador
        fields = (
            "id",
            "classe",
            "assunto",
            "assunto_principal_normalizado",
            "assunto_principal_normalizado_details",
            "area",
            "orgao_julgador",
            "valor",
            "valor_details",
            "data_distribuicao",
            "data_arquivamento",
        )


class InformacaoComplementarProcessoFonteCapaEscavadorSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = InformacaoComplementarProcessoFonteCapaEscavador
        fields = (
            "id",
            "processo_fonte_capa",
            "informacao_complementar",
        )


class EstadoEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadosEscavador
        fields = (
            "id",
            "nome",
            "sigla",
        )


class TribunalEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TribunalEscavador
        fields = (
            "id",
            "id_escavador",
            "nome",
            "sigla",
            "categoria",
        )


class TribunalEstadosEscavadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TribunalEstadosEscavador
        fields = (
            "id",
            "tribunal",
            "estado",
        )


class AssuntoNormalizadoProcessoFonteCapaEscavadorSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = AssuntoNormalizadoProcessoFonteCapaEscavador
        fields = (
            "id",
            "assunto_normalizado",
            "processo_fonte_capa",
        )
