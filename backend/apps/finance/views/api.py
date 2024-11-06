from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authentication.permissions import CustomDjangoModelPermissions
from apps.finance import models, serializers, filters

from django.db.models import Sum


class BillViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]

    queryset = models.Bill.objects.all()
    serializer_class = serializers.BillSerializer

    permission_classes = [
        IsAuthenticated,
        CustomDjangoModelPermissions,
    ]

    filterset_class = filters.BillFilter

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=False, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data)


class BillCategoryViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]

    queryset = models.BillCategory.objects.all()
    serializer_class = serializers.BillCategorySerializer

    permission_classes = [
        IsAuthenticated,
        CustomDjangoModelPermissions,
    ]

    filterset_fields = ("active",)


class BillValueView(generics.GenericAPIView):
    http_method_names = ["get", "options", "head"]
    serializer_class = serializers.BillValueSerializer
    permission_classes = [
        IsAuthenticated,
        CustomDjangoModelPermissions,
    ]

    queryset = models.Bill.objects.all()
    filterset_class = filters.BillFilter

    def get(self, request, *args, **kwargs):
        if not self._validate_filters():
            return Response(
                {
                    "detail": "You must provide at least one filter to get the total value of the bills."
                },
                status=400,
            )

        queryset = self.filter_queryset(self.get_queryset())
        value_income = (
            queryset.filter(bill_type="IN").aggregate(Sum("value")).get("value__sum")
            or 0.0
        )
        value_outcome = (
            queryset.filter(bill_type="OUT").aggregate(Sum("value")).get("value__sum")
            or 0.0
        )
        net_income = float(value_income) - float(value_outcome)
        serializer = self.serializer_class(
            {
                "quantity": queryset.count(),
                "total_in": value_income,
                "total_out": value_outcome,
                "net_income": net_income,
                "bills": queryset,
            }
        )
        return Response(serializer.data)

    def _validate_filters(self) -> bool:
        filters = self.filterset_class.get_filters().keys()
        url_query_params = self.request.query_params.dict().items()
        for k, v in url_query_params:
            if v and k in filters:
                return True
        return False
