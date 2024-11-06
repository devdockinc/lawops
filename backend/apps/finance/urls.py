from django.urls import include, path
from rest_framework.routers import SimpleRouter

from apps.finance import views

bill_api_v1_router = SimpleRouter()
bill_api_v1_router.register("", views.BillViewSet, basename="bill-api-v1")

bill_category_api_v1_router = SimpleRouter()
bill_category_api_v1_router.register(
    "", views.BillCategoryViewSet, basename="bill-category-api-v1"
)


app_name = "finance"

urlpatterns = [
    path(
        "api/v1/finance/value/", views.BillValueView.as_view(), name="bill-value-api-v1"
    ),
    path("api/v1/finance/category/", include(bill_category_api_v1_router.urls)),
    path("api/v1/finance/", include(bill_api_v1_router.urls)),
]
