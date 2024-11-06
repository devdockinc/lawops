from django.urls import include, path
from rest_framework.routers import SimpleRouter

from apps.announcement import views

announcement_api_v1_router = SimpleRouter()
announcement_api_v1_router.register(
    "", views.AnnouncementViewSet, basename="announcement-api-v1"
)

app_name = "announcement"

urlpatterns = [
    path("api/v1/announcement/", include(announcement_api_v1_router.urls)),
]
