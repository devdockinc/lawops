from rest_framework import serializers

from apps.escavador.models.processo import ProcessoEscavador
from apps.escavador.serializers.envolvido import EnvolvidoEscavadorSerializer
from apps.escavador.serializers.fontes import ProcessoFonteEscadorSerializer
from apps.lawsuit.serializers import LawsuitSerializer

from apps.lawsuit.models import Lawsuit


class ProcessoEscavadorSerializer(serializers.ModelSerializer):
    envolvidos_processo = EnvolvidoEscavadorSerializer(many=True, read_only=True)

    class Meta:
        model = ProcessoEscavador
        fields = (
            "id",
            "numero_cnj",
            "titulo_polo_ativo",
            "titulo_polo_passivo",
            "ano_inicio",
            "estado_origem",
            "data_inicio",
            "data_ultima_movimentacao",
            "quantidade_movimentacoes",
            "fontes_tribunais_estao_arquivadas",
            "data_ultima_verificacao",
            "tempo_desde_ultima_verificacao",
            "envolvidos_processo",
        )


class ProcessoEscavadorResumoSerializer(serializers.ModelSerializer):
    processo_fonte = ProcessoFonteEscadorSerializer(many=True, read_only=True)
    envolvidos_processo = EnvolvidoEscavadorSerializer(many=True, read_only=True)
    lawops_lawsuit = serializers.SerializerMethodField()

    class Meta:
        model = ProcessoEscavador
        fields = (
            "id",
            "numero_cnj",
            "titulo_polo_ativo",
            "titulo_polo_passivo",
            "ano_inicio",
            "data_inicio",
            "processo_fonte",
            "envolvidos_processo",
            "lawops_lawsuit",
        )

    def get_lawops_lawsuit(self, obj):
        try:
            return LawsuitSerializer(
                Lawsuit.objects.get(cnj_number=obj.numero_cnj)
            ).data
        except Lawsuit.DoesNotExist:
            return None
