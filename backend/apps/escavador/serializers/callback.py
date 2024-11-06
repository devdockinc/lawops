from rest_framework import serializers


class ProcessoEscavadorCallbackSerializer(serializers.Serializer):
    origem = serializers.CharField(allow_blank=True, allow_null=True)
    instancia = serializers.CharField(allow_blank=True, allow_null=True)
    extra_instancia = serializers.CharField(allow_blank=True, allow_null=True)
    numero_unico = serializers.CharField()


class MonitorCallbackSerializer(serializers.Serializer):
    origens = serializers.ListField(
        child=serializers.CharField(), allow_empty=True, allow_null=True
    )
    tipo = serializers.CharField(allow_blank=True, allow_null=True)
    valor = serializers.CharField()
    cron = serializers.CharField(allow_blank=True, allow_null=True)


class MonioramentoAppCallbackSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    monitor = MonitorCallbackSerializer()


class MonitoramentoCallbackSerializer(serializers.Serializer):
    processo = ProcessoEscavadorCallbackSerializer()
    event = serializers.CharField()
    event_data = serializers.DictField()
    app = MonioramentoAppCallbackSerializer()
