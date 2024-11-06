from django.urls import include, path
from rest_framework.routers import SimpleRouter

from apps.notification import views

recipient_api_v1_router = SimpleRouter()
recipient_api_v1_router.register(
    "", views.RecipientViewSet, basename="recipient-api-v1"
)

notification_api_v1_router = SimpleRouter()
notification_api_v1_router.register(
    "", views.NotificationViewSet, basename="notification-api-v1"
)

notification_history_api_v1_router = SimpleRouter()
notification_history_api_v1_router.register(
    "", views.NotificationHistoryViewSet, basename="notification-history-api-v1"
)


app_name = "notification"

urlpatterns = [
    path("api/v1/notification/recipient/", include(recipient_api_v1_router.urls)),
    path(
        "api/v1/notification/history/", include(notification_history_api_v1_router.urls)
    ),
    path("api/v1/notification/", include(notification_api_v1_router.urls)),
]
