from django_filters import rest_framework as filters
from apps.escavador import models
from django.db.models import Q, Exists, OuterRef

from apps.lawsuit.models import Lawsuit


class ProcessoEscavadorFilter(filters.FilterSet):
    q = filters.CharFilter(method="filter_q")
    automatic_update = filters.BooleanFilter(method="filter_automatic_update")

    def filter_q(self, queryset, _, value):
        return queryset.filter(
            Q(numero_cnj__icontains=value)
            | Q(ano_inicio__icontains=value)
            | Q(processo_fonte__descricao__icontains=value)
            | Q(processo_fonte__nome__icontains=value)
            | Q(processo_fonte__sigla__icontains=value)
            | Q(processo_fonte__tipo__icontains=value)
            | Q(processo_fonte__capa__area__icontains=value)
        ).distinct()

    def filter_automatic_update(self, queryset, _, value):
        lawsuit = Lawsuit.objects.filter(
            automatic_update=value,
            cnj_number=OuterRef("numero_cnj"),
        )
        return queryset.annotate(lawsuit_exists=Exists(lawsuit)).filter(
            lawsuit_exists=True
        )

    class Meta:
        model = models.ProcessoEscavador
        fields = {
            "numero_cnj": ["exact"],
            "ano_inicio": ["exact"],
            "processo_fonte__id": ["exact"],
            "processo_fonte__descricao": ["exact", "icontains"],
            "processo_fonte__nome": ["exact", "icontains"],
            "processo_fonte__sigla": ["exact", "icontains"],
            "processo_fonte__tipo": ["exact", "icontains"],
            "processo_fonte__capa__area": ["exact", "icontains"],
        }


class MovimentacaoEscavadorFilter(filters.FilterSet):
    class Meta:
        model = models.MovimentacaoEscavador
        fields = {
            "processo": ["exact"],
            "processo__numero_cnj": ["exact"],
        }
