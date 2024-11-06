from django.urls import include, path
from rest_framework.routers import SimpleRouter

from apps.parameter import views

app_name = "parameter"

parameter_api_v1_router = SimpleRouter()
parameter_api_v1_router.register(
    "", views.ParameterViewSet, basename="parameter-api-v1"
)

urlpatterns = [
    path("api/v1/parameter/", include(parameter_api_v1_router.urls)),
]
