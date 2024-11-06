from django.db import models

from apps.escavador.models.capa import EstadosEscavador


class ProcessoEscavadorManager(models.Manager): ...


class ProcessoEscavador(models.Model):
    objects = ProcessoEscavadorManager()

    id: int
    numero_cnj = models.CharField(max_length=50, unique=True)
    titulo_polo_ativo = models.CharField(max_length=255, null=True, blank=True)
    titulo_polo_passivo = models.CharField(max_length=255, null=True, blank=True)
    ano_inicio = models.CharField(max_length=4)
    data_inicio = models.CharField(max_length=50, null=True, blank=True)
    estado_origem = models.ForeignKey(
        EstadosEscavador, on_delete=models.CASCADE, null=True, blank=True, default=None
    )
    data_ultima_movimentacao = models.CharField(max_length=50, null=True, blank=True)
    quantidade_movimentacoes = models.IntegerField(null=True, blank=True)
    fontes_tribunais_estao_arquivadas = models.BooleanField(default=False)
    data_ultima_verificacao = models.CharField(max_length=50)
    tempo_desde_ultima_verificacao = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Processo"
        verbose_name_plural = "Processo"
        ordering = ["-id"]
