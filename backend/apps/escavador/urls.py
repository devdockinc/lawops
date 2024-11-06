from django.urls import include, path
from rest_framework.routers import SimpleRouter

from apps.escavador import views

app_name = "escavador"

processo_api_v1_router = SimpleRouter()
processo_api_v1_router.register(
    "", views.ProcessoEscavadorViewSet, basename="processo-api-v1"
)


movimentacao_api_v1_router = SimpleRouter()
movimentacao_api_v1_router.register(
    "", views.MovimentacaoEscavadorViewSet, basename="movimentacao-api-v1"
)

processo_fonte_api_v1_router = SimpleRouter()
processo_fonte_api_v1_router.register(
    "", views.ProcessoFonteEscavadorViewSet, basename="processo-fonte-api-v1"
)

envolvido_api_v1_router = SimpleRouter()
envolvido_api_v1_router.register(
    "", views.EnvolvidoEscavadorViewSet, basename="envolvido-api-v1"
)

oab_api_v1_router = SimpleRouter()
oab_api_v1_router.register("", views.OabEscavadorViewSet, basename="oab-api-v1")

oab_envolvido_api_v1_router = SimpleRouter()
oab_envolvido_api_v1_router.register(
    "", views.OabEnvolvidoViewSet, basename="oab-envolvido-api-v1"
)

envolvidos_processo_fonte_api_v1_router = SimpleRouter()
envolvidos_processo_fonte_api_v1_router.register(
    "",
    views.EnvolvidosProcessoFonteEscavadorViewSet,
    basename="envolvidos-processo-fonte-api-v1",
)

valor_causa_api_v1_router = SimpleRouter()
valor_causa_api_v1_router.register(
    "", views.ValorCausaEscavadorViewSet, basename="valor-causa-api-v1"
)

assunto_normalizado_api_v1_router = SimpleRouter()
assunto_normalizado_api_v1_router.register(
    "", views.AssuntoNormalizadoEscavadorViewSet, basename="assunto-normalizado-api-v1"
)

informacao_complementar_api_v1_router = SimpleRouter()
informacao_complementar_api_v1_router.register(
    "",
    views.InformacaoComplementarEscavadorViewSet,
    basename="informacao-complementar-api-v1",
)

processo_fonte_capa_api_v1_router = SimpleRouter()
processo_fonte_capa_api_v1_router.register(
    "",
    views.ProcessoFonteCapaEscavadorViewSet,
    basename="processo-fonte-capa-api-v1",
)

informacao_complementar_processo_fonte_capa_api_v1_router = SimpleRouter()
informacao_complementar_processo_fonte_capa_api_v1_router.register(
    "",
    views.InformacaoComplementarProcessoFonteCapaEscavadorViewSet,
    basename="informacao-complementar-processo-fonte-capa-api-v1",
)

estado_api_v1_router = SimpleRouter()
estado_api_v1_router.register(
    "", views.EstadoEscavadorViewSet, basename="estado-api-v1"
)

tribunal_api_v1_router = SimpleRouter()
tribunal_api_v1_router.register(
    "", views.TribunalEscavadorViewSet, basename="tribunal-api-v1"
)

tribunal_estados_api_v1_router = SimpleRouter()
tribunal_estados_api_v1_router.register(
    "",
    views.TribunalEstadosEscavadorViewSet,
    basename="tribunal-estados-api-v1",
)

assunto_normalizado_processo_fonte_capa_api_v1_router = SimpleRouter()
assunto_normalizado_processo_fonte_capa_api_v1_router.register(
    "",
    views.AssuntoNormalizadoProcessoFonteCapaEscavadorViewSet,
    basename="assunto-normalizado-processo-fonte-capa-api-v1",
)

urlpatterns = [
    path("api/v1/escavador/processo/", include(processo_api_v1_router.urls)),
    path("api/v1/escavador/movimentacao/", include(movimentacao_api_v1_router.urls)),
    path(
        "api/v1/escavador/processo-fonte/", include(processo_fonte_api_v1_router.urls)
    ),
    path("api/v1/escavador/envolvido/", include(envolvido_api_v1_router.urls)),
    path("api/v1/escavador/oab/", include(oab_api_v1_router.urls)),
    path(
        "api/v1/escavador/oab-envolvido/",
        include(oab_envolvido_api_v1_router.urls),
    ),
    path(
        "api/v1/escavador/envolvidos-processo-fonte/",
        include(envolvidos_processo_fonte_api_v1_router.urls),
    ),
    path(
        "api/v1/escavador/valor-causa/",
        include(valor_causa_api_v1_router.urls),
    ),
    path(
        "api/v1/escavador/assunto-normalizado/",
        include(assunto_normalizado_api_v1_router.urls),
    ),
    path(
        "api/v1/escavador/informacao-complementar/",
        include(informacao_complementar_api_v1_router.urls),
    ),
    path(
        "api/v1/escavador/processo-fonte-capa/",
        include(processo_fonte_capa_api_v1_router.urls),
    ),
    path(
        "api/v1/escavador/informacao-complementar-processo-fonte-capa/",
        include(informacao_complementar_processo_fonte_capa_api_v1_router.urls),
    ),
    path("api/v1/escavador/estado/", include(estado_api_v1_router.urls)),
    path("api/v1/escavador/tribunal/", include(tribunal_api_v1_router.urls)),
    path(
        "api/v1/escavador/tribunal-estados/",
        include(tribunal_estados_api_v1_router.urls),
    ),
    path(
        "api/v1/escavador/assunto-normalizado-processo-fonte-capa/",
        include(assunto_normalizado_processo_fonte_capa_api_v1_router.urls),
    ),
    path(
        "api/v1/escavador/processo-resumo/",
        views.ProcessoEscavadorResumoView.as_view(),
        name="processo-resumo",
    ),
    path(
        "api/v1/escavador/callback/",
        views.CallbackMonitoramentoEscavadorView.as_view(),
        name="callback-escavador",
    ),
]
