from django_filters import rest_framework as filters
from django.db.models import Q

from django.contrib.auth import get_user_model


class UserFilter(filters.FilterSet):
    q = filters.CharFilter(method="filter_q")

    def filter_q(self, queryset, _, value):
        return queryset.filter(
            Q(username__icontains=value)
            | Q(first_name__icontains=value)
            | Q(last_name__icontains=value)
        )

    class Meta:
        model = get_user_model()
        fields = {
            "username": ["exact", "icontains"],
            "email": ["exact", "icontains"],
            "is_active": ["exact"],
            "is_staff": ["exact"],
            "is_superuser": ["exact"],
        }
