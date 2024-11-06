from django.db import models


class AssuntoNormalizadoEscavadorManager(models.Manager): ...


class AssuntoNormalizadoEscavador(models.Model):
    objects = AssuntoNormalizadoEscavadorManager()
    id: int
    id_escavador = models.PositiveBigIntegerField()
    nome = models.CharField(max_length=512, null=True, blank=True, default=None)
    nome_com_pai = models.CharField(max_length=512, null=True, blank=True, default=None)
    path_completo = models.CharField(
        max_length=512, null=True, blank=True, default=None
    )

    class Meta:
        verbose_name = "Assunto Normalizado"
        verbose_name_plural = "Assuntos Normalizados"
        ordering = ["-id"]


class ValorCausaEscavadorManager(models.Manager): ...


class ValorCausaEscavador(models.Model):
    objects = ValorCausaEscavadorManager()
    id: int
    valor = models.CharField(max_length=255)
    moeda = models.CharField(max_length=255)
    valor_formatado = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Valor Causa"
        verbose_name_plural = "Valores Causa"
        ordering = ["-id"]


class InformacaoComplementarEscavadorManager(models.Manager): ...


class InformacaoComplementarEscavador(models.Model):
    objects = InformacaoComplementarEscavadorManager()
    id: int
    tipo = models.CharField(max_length=512)
    valor = models.TextField()

    class Meta:
        verbose_name = "Informação Complementar"
        verbose_name_plural = "Informações Complementares"
        ordering = ["-id"]


class ProcessoFonteCapaEscavadorManager(models.Manager): ...


class ProcessoFonteCapaEscavador(models.Model):
    objects = ProcessoFonteCapaEscavadorManager()
    id: int
    classe = models.CharField(max_length=512)
    assunto = models.CharField(max_length=512, null=True, blank=True)
    assunto_principal_normalizado = models.ForeignKey(
        AssuntoNormalizadoEscavador, on_delete=models.CASCADE, null=True, blank=True
    )
    area = models.CharField(max_length=512, null=True, blank=True)
    orgao_julgador = models.CharField(max_length=512, null=True, blank=True)
    valor = models.ForeignKey(
        ValorCausaEscavador, on_delete=models.CASCADE, null=True, blank=True
    )
    data_distribuicao = models.CharField(max_length=10, null=True, blank=True)
    data_arquivamento = models.CharField(max_length=10, null=True, blank=True)

    class Meta:
        verbose_name = "Processo Fonte Capa"
        verbose_name_plural = "Processos Fonte Capa"
        ordering = ["-id"]


class InformacaoComplementarProcessoFonteCapaEscavadorManager(models.Manager): ...


class InformacaoComplementarProcessoFonteCapaEscavador(models.Model):
    objects = InformacaoComplementarProcessoFonteCapaEscavadorManager()
    id: int
    processo_fonte_capa = models.ForeignKey(
        ProcessoFonteCapaEscavador, on_delete=models.CASCADE
    )
    informacao_complementar = models.ForeignKey(
        InformacaoComplementarEscavador, on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = "Informação Complementar Processo Fonte Capa"
        verbose_name_plural = "Informações Complementares Processo Fonte Capa"
        ordering = ["-id"]


class AssuntoNormalizadoProcessoFonteCapaEscavadorManager(models.Manager): ...


class AssuntoNormalizadoProcessoFonteCapaEscavador(models.Model):
    objects = AssuntoNormalizadoProcessoFonteCapaEscavadorManager()
    id: int
    assunto_normalizado = models.ForeignKey(
        AssuntoNormalizadoEscavador, on_delete=models.CASCADE
    )
    processo_fonte_capa = models.ForeignKey(
        ProcessoFonteCapaEscavador, on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = "Assunto Normalizado Processo Fonte Capa"
        verbose_name_plural = "Assuntos Normalizados Processo Fonte Capa"
        ordering = ["-id"]


class EstadosEscavadorManager(models.Manager): ...


class EstadosEscavador(models.Model):
    objects = EstadosEscavadorManager()
    id: int
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=2)

    class Meta:
        verbose_name = "Estado"
        verbose_name_plural = "Estados"
        ordering = ["-id"]


class TribunalEscavadorManager(models.Manager): ...


class TribunalEscavador(models.Model):
    objects = TribunalEscavadorManager()
    id: int
    id_escavador = models.PositiveBigIntegerField()

    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=255)
    categoria = models.CharField(max_length=255, null=True, blank=True, default=None)

    class Meta:
        verbose_name = "Tribunal"
        verbose_name_plural = "Tribunais"
        ordering = ["-id"]


class TribunalEstadosEscavadorManager(models.Manager): ...


class TribunalEstadosEscavador(models.Model):
    objects = TribunalEstadosEscavadorManager()
    id: int
    tribunal = models.ForeignKey(TribunalEscavador, on_delete=models.CASCADE)
    estado = models.ForeignKey(EstadosEscavador, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Tribunal Estado"
        verbose_name_plural = "Tribunais Estados"
        ordering = ["-id"]
