from django.contrib import admin

from apps.escavador import models

admin.site.register(models.EstadosEscavador, admin.ModelAdmin)
admin.site.register(models.OabEscavador, admin.ModelAdmin)
admin.site.register(models.OabEnvolvido, admin.ModelAdmin)
admin.site.register(models.TribunalEscavador, admin.ModelAdmin)
admin.site.register(models.ProcessoEscavador, admin.ModelAdmin)
admin.site.register(models.EnvolvidoEscavador, admin.ModelAdmin)
admin.site.register(models.ValorCausaEscavador, admin.ModelAdmin)
admin.site.register(models.ProcessoFonteEscavador, admin.ModelAdmin)
admin.site.register(models.TribunalEstadosEscavador, admin.ModelAdmin)
admin.site.register(models.ProcessoFonteCapaEscavador, admin.ModelAdmin)
admin.site.register(models.AssuntoNormalizadoEscavador, admin.ModelAdmin)
admin.site.register(models.InformacaoComplementarEscavador, admin.ModelAdmin)
admin.site.register(models.EnvolvidosProcessoFonteEscavador, admin.ModelAdmin)
admin.site.register(
    models.AssuntoNormalizadoProcessoFonteCapaEscavador, admin.ModelAdmin
)
admin.site.register(
    models.InformacaoComplementarProcessoFonteCapaEscavador, admin.ModelAdmin
)
admin.site.register(models.MovimentacaoEscavador, admin.ModelAdmin)
