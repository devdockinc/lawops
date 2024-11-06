from django.db import models

from apps.escavador.models.capa import ProcessoFonteCapaEscavador, TribunalEscavador
from apps.escavador.models.processo import ProcessoEscavador


class ProcessoFonteEscavadorManager(models.Manager): ...


class ProcessoFonteEscavador(models.Model):
    STATUS_CHOICES = (("A", "Ativo"), ("I", "Inativo"))
    objects = ProcessoFonteEscavadorManager()

    id: int
    processo = models.ForeignKey(
        ProcessoEscavador, on_delete=models.CASCADE, related_name="processo_fonte"
    )
    id_escavador = models.PositiveBigIntegerField()
    processo_fonte_id = models.PositiveBigIntegerField()
    descricao = models.CharField(max_length=255)
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=10)
    tipo = models.CharField(max_length=255)
    data_inicio = models.CharField(max_length=10, null=True, blank=True)
    data_ultima_movimentacao = models.CharField(
        max_length=50, null=True, blank=True, default=None
    )
    segredo_justica = models.BooleanField(null=True, blank=True)
    arquivado = models.BooleanField(null=True, blank=True)
    status_predito = models.CharField(
        max_length=1, choices=STATUS_CHOICES, null=True, blank=True, default=None
    )
    grau = models.CharField(max_length=255)
    grau_formatado = models.CharField(max_length=255)
    fisico = models.BooleanField(null=True, blank=True)
    sistema = models.CharField(max_length=255)
    url = models.CharField(max_length=1024, null=True, blank=True, default=None)
    quantidade_movimentacoes = models.IntegerField()
    data_ultima_verificacao = models.CharField(max_length=30)

    capa = models.ForeignKey(
        ProcessoFonteCapaEscavador, on_delete=models.CASCADE, null=True, blank=True
    )

    tribunal = models.ForeignKey(
        TribunalEscavador, on_delete=models.CASCADE, null=True, blank=True
    )

    caderno = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        verbose_name = "ProcessoFonte"
        verbose_name_plural = "ProcessoFonte"
        ordering = ["-id"]
