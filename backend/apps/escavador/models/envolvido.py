from django.db import models

from apps.escavador.models.processo import ProcessoEscavador
from apps.escavador.models.fontes import ProcessoFonteEscavador


class EnvolvidoEscavadorManager(models.Manager): ...


class EnvolvidoEscavador(models.Model):
    objects = EnvolvidoEscavadorManager()

    TIPO_PESSOA_CHOICES = (("F", "Física"), ("J", "Jurídica"))

    id: int
    processo = models.ForeignKey(
        ProcessoEscavador, on_delete=models.CASCADE, related_name="envolvidos_processo"
    )
    id_escavador = models.PositiveBigIntegerField(null=True, blank=True)
    nome = models.CharField(max_length=512, null=True, blank=True)
    quantidade_processos = models.IntegerField()
    tipo_pessoa = models.CharField(max_length=1, choices=TIPO_PESSOA_CHOICES)
    prefixo = models.CharField(max_length=255, null=True, blank=True)
    sufixo = models.CharField(max_length=255, null=True, blank=True)
    tipo = models.CharField(max_length=255, null=True, blank=True)
    tipo_normalizado = models.CharField(max_length=255, null=True, blank=True)
    polo = models.CharField(max_length=255, null=True, blank=True)
    cpf = models.CharField(max_length=11, null=True, blank=True)
    cnpj = models.CharField(max_length=14, null=True, blank=True)

    class Meta:
        verbose_name = "Envolvido"
        verbose_name_plural = "Envolvido"
        ordering = ["-id"]


class OabEscavadorManager(models.Manager): ...


class OabEscavador(models.Model):
    objects = OabEscavadorManager()

    id: int
    numero = models.CharField(max_length=255)
    uf = models.CharField(max_length=2)
    tipo = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Oab"
        verbose_name_plural = "Oab"
        ordering = ["-id"]


class OabEnvolvidoManager(models.Manager): ...


class OabEnvolvido(models.Model):
    objects = OabEnvolvidoManager()
    id: int
    envolvido = models.ForeignKey(EnvolvidoEscavador, on_delete=models.CASCADE)
    oab = models.ForeignKey(
        OabEscavador, on_delete=models.CASCADE, null=True, blank=True
    )

    class Meta:
        verbose_name = "Oab Envolvido"
        verbose_name_plural = "Oab Envolvidos"
        ordering = ["-id"]


class EnvolvidosProcessoFonteEscavadorManager(models.Manager): ...


class EnvolvidosProcessoFonteEscavador(models.Model):
    objects = EnvolvidosProcessoFonteEscavadorManager()
    id: int
    envolvido = models.ForeignKey(EnvolvidoEscavador, on_delete=models.CASCADE)
    processo_fonte = models.ForeignKey(ProcessoFonteEscavador, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Envolvido Processo Fonte"
        verbose_name_plural = "Envolvidos Processo Fonte"
        ordering = ["-id"]
