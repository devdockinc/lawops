from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.mixins import Response, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet

from apps.authentication.permissions import CustomDjangoModelPermissions
from apps.escavador import models, serializers, filters

from dotenv import load_dotenv
from apps.escavador.models.movimentacao import MovimentacaoEscavador
from utils.env import get_env_variable
from django.utils.crypto import constant_time_compare


load_dotenv()


class ProcessoEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.ProcessoEscavador.objects.all()
    serializer_class = serializers.ProcessoEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class MovimentacaoEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.MovimentacaoEscavador.objects.all()
    serializer_class = serializers.MovimentacaoEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]
    filterset_class = filters.MovimentacaoEscavadorFilter


class ProcessoFonteEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.ProcessoFonteEscavador.objects.all()
    serializer_class = serializers.ProcessoFonteEscadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class EnvolvidoEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.EnvolvidoEscavador.objects.all()
    serializer_class = serializers.EnvolvidoEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class OabEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.OabEscavador.objects.all()
    serializer_class = serializers.OabEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class OabEnvolvidoViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.OabEnvolvido.objects.all()
    serializer_class = serializers.OabEnvolvidoSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class EnvolvidosProcessoFonteEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.EnvolvidosProcessoFonteEscavador.objects.all()
    serializer_class = serializers.EnvolvidosProcessoFonteEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class ValorCausaEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.ValorCausaEscavador.objects.all()
    serializer_class = serializers.ValorCausaEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class AssuntoNormalizadoEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.AssuntoNormalizadoEscavador.objects.all()
    serializer_class = serializers.AssuntoNormalizadoEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class InformacaoComplementarEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.InformacaoComplementarEscavador.objects.all()
    serializer_class = serializers.InformacaoComplementarEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class ProcessoFonteCapaEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.ProcessoFonteCapaEscavador.objects.all()
    serializer_class = serializers.ProcessoFonteCapaEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class InformacaoComplementarProcessoFonteCapaEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.InformacaoComplementarProcessoFonteCapaEscavador.objects.all()
    serializer_class = (
        serializers.InformacaoComplementarProcessoFonteCapaEscavadorSerializer
    )
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class EstadoEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.EstadosEscavador.objects.all()
    serializer_class = serializers.EstadoEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class TribunalEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.TribunalEscavador.objects.all()
    serializer_class = serializers.TribunalEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class TribunalEstadosEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.TribunalEstadosEscavador.objects.all()
    serializer_class = serializers.TribunalEstadosEscavadorSerializer
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class AssuntoNormalizadoProcessoFonteCapaEscavadorViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]
    queryset = models.AssuntoNormalizadoProcessoFonteCapaEscavador.objects.all()
    serializer_class = (
        serializers.AssuntoNormalizadoProcessoFonteCapaEscavadorSerializer
    )
    permission_classes = [CustomDjangoModelPermissions, IsAuthenticated]


class ProcessoEscavadorResumoView(ListAPIView):
    http_method_names = ["get", "options", "head"]
    serializer_class = serializers.ProcessoEscavadorResumoSerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]
    queryset = models.ProcessoEscavador.objects.all()
    filterset_class = filters.ProcessoEscavadorFilter


class CallbackMonitoramentoEscavadorView(CreateAPIView):
    http_method_names = ["post", "options", "head"]
    serializer_class = serializers.MonitoramentoCallbackSerializer

    permission_classes = [
        AllowAny,
    ]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        if not self._validate_token(request):
            return Response(
                data={"detail": "Invalid escavador token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=False, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        processo = models.ProcessoEscavador.objects.filter(
            numero_cnj=data.get("processo").get("numero_unico")
        ).first()

        if not processo:
            return Response(
                data={"detail": "Processo not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        event_data = data.get("event_data")

        if data.get("event") == "movimentacao_nova":
            if MovimentacaoEscavador.objects.filter(
                id_escavador=event_data.get("id")
            ).exists():
                return Response(
                    data={"detail": "Movimentacao already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            models.MovimentacaoEscavador.objects.create(
                processo=processo,
                id_escavador=event_data.get("id"),
                data=event_data.get("data"),
                conteudo=event_data.get("conteudo"),
                tipo="MONITORAMENTO",
            )

        elif data.get("event") == "envolvido_novo":
            if models.EnvolvidoEscavador.objects.filter(
                id_escavador=event_data.get("id")
            ).exists():
                return Response(
                    data={"detail": "Envolvido already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            documento = event_data.get("documento").get("tipo")
            tipo_pessoa = "F" if documento == "CPF" else "J"
            cpf = (
                event_data.get("documento").get("numero")
                if tipo_pessoa == "F"
                else None
            )
            cnpj = (
                event_data.get("documento").get("numero")
                if tipo_pessoa == "J"
                else None
            )

            models.EnvolvidoEscavador.objects.create(
                processo=processo,
                id_escavador=event_data.get("id"),
                nome=event_data.get("nome"),
                quantidade_processos=0,
                tipo=event_data.get("tipo"),
                polo=event_data.get("polo"),
                tipo_pessoa=tipo_pessoa,
                cpf=cpf,
                cnpj=cnpj,
            )

            if advogado_de := event_data.get("advogado_de"):
                if models.EnvolvidoEscavador.objects.filter(
                    id_escavador=advogado_de.get("id")
                ).exists():
                    return Response(
                        data={"detail": "Advogado already exists"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                documento_advogado_de = advogado_de.get("documento").get("tipo")
                tipo_pessoa_advogado_de = "F" if documento_advogado_de == "CPF" else "J"
                cpf_advogado_de = (
                    advogado_de.get("documento").get("numero")
                    if tipo_pessoa_advogado_de == "F"
                    else None
                )
                cnpj_advogado_de = (
                    advogado_de.get("documento").get("numero")
                    if tipo_pessoa_advogado_de == "J"
                    else None
                )

                models.EnvolvidoEscavador.objects.create(
                    processo=processo,
                    nome=advogado_de.get("nome"),
                    id_escavador=advogado_de.get("id"),
                    quantidade_processos=0,
                    tipo=advogado_de.get("tipo"),
                    polo=advogado_de.get("polo"),
                    tipo_pessoa=tipo_pessoa_advogado_de,
                    cpf=cpf_advogado_de,
                    cnpj=cnpj_advogado_de,
                )

        return Response(
            data=serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def _validate_token(self, request):
        token_env = get_env_variable("ESCAVADOR_CALLBACK_TOKEN", "")
        token_header = request.headers.get("Authorization")

        if not token_env or not token_header:
            return False
        if not constant_time_compare(token_header, token_env):
            return False
        return True
