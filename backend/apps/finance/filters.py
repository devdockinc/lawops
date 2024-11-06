from django_filters import rest_framework as filters
from django.db.models import Q

from apps.finance.models.bill import Bill


class BillFilter(filters.FilterSet):
    q = filters.CharFilter(method="filter_q")
    o = filters.OrderingFilter(
        fields=(
            ("due_date", "due_date"),
            ("payment_date", "payment_date"),
            ("value", "value"),
            ("created_at", "created_at"),
            ("updated_at", "updated_at"),
        )
    )

    def filter_q(self, queryset, _, value):
        return queryset.filter(
            Q(description__icontains=value) | Q(observation__icontains=value)
        )

    class Meta:
        model = Bill
        fields = {
            "bill_type": ["exact"],
            "value": ["lt", "lte", "gt", "gte", "exact"],
            "category": ["isnull", "exact"],
            "active": ["exact"],
            "due_date": ["lt", "lte", "gt", "gte", "isnull", "exact"],
            "payment_date": ["lt", "lte", "gt", "gte", "isnull", "exact"],
            "status": ["exact"],
            "lawsuit": ["isnull", "exact"],
        }
