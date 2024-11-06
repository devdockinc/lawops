from django.db import models

from apps.escavador.models.processo import ProcessoEscavador


class MovimentacaoEscavadorManager(models.Manager): ...


class MovimentacaoEscavador(models.Model):
    objects = MovimentacaoEscavadorManager()

    id: int
    processo = models.ForeignKey(ProcessoEscavador, on_delete=models.CASCADE)
    id_escavador = models.PositiveBigIntegerField()
    data = models.CharField(max_length=10)
    tipo = models.CharField(max_length=255)
    conteudo = models.TextField()
    fonte_id = models.PositiveBigIntegerField(null=True, blank=True, default=None)
    fonte_nome = models.CharField(max_length=512, null=True, blank=True, default=None)
    fonte_tipo = models.CharField(max_length=255, null=True, blank=True, default=None)
    fonte_sigla = models.CharField(max_length=255, null=True, blank=True, default=None)
    fonte_grau = models.IntegerField(null=True, blank=True, default=None)
    fonte_grau_formatado = models.CharField(
        max_length=255, null=True, blank=True, default=None
    )
    fonte_caderno = models.CharField(
        max_length=512, null=True, blank=True, default=None
    )

    class Meta:
        verbose_name = "Movimentacao"
        verbose_name_plural = "Movimentacao"
        ordering = ["-id"]
