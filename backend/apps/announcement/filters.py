from django_filters import rest_framework as filters
from apps.announcement.models import Announcement
from django.db.models import Q


class AnnouncementFilter(filters.FilterSet):
    q = filters.CharFilter(method="filter_q")
    o = filters.OrderingFilter(
        fields=(
            ("created_at", "created_at"),
            ("updated_at", "updated_at"),
        )
    )

    def filter_q(self, queryset, _, value):
        return queryset.filter(Q(title__icontains=value) | Q(content__icontains=value))

    class Meta:
        model = Announcement
        fields = (
            "status",
            "author",
            "severity",
            "notified",
        )
