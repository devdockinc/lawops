from django.urls import include, path
from rest_framework.routers import SimpleRouter

from apps.lawsuit import views

app_name = "lawsuit"

lawsuit_api_v1_router = SimpleRouter()
lawsuit_api_v1_router.register("", views.LawsuitViewSet, basename="lawsuit-api-v1")

lawsuit_comment_api_v1_router = SimpleRouter()
lawsuit_comment_api_v1_router.register(
    "", views.LawsuitCommentViewSet, basename="lawsuit-comments-api-v1"
)

urlpatterns = [
    path("api/v1/lawsuit/comment/", include(lawsuit_comment_api_v1_router.urls)),
    path("api/v1/lawsuit/", include(lawsuit_api_v1_router.urls)),
]
