from rest_framework.routers import SimpleRouter
from apps.authentication import views
from django.urls import path, include

app_name = "authentication"

user_api_v1_router = SimpleRouter()
user_api_v1_router.register("", views.UserViewSet, basename="user-api-v1")

urlpatterns = [
    path("api/v1/user/", include(user_api_v1_router.urls)),
]
