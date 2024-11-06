from rest_framework import serializers

from apps.finance import models
from apps.authentication import serializers as auth_serializers
from apps.lawsuit import serializers as lawsuit_serializers


class BillCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BillCategory
        fields = (
            "id",
            "active",
            "name",
            "description",
            "created_at",
            "updated_at",
        )


class BillSerializer(serializers.ModelSerializer):
    created_by = auth_serializers.UserSerializer(read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.BillCategory.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    category_details = BillCategorySerializer(source="category", read_only=True)

    lawsuit = serializers.PrimaryKeyRelatedField(
        queryset=models.Lawsuit.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    lawsuit_details = lawsuit_serializers.LawsuitSerializer(
        source="lawsuit", read_only=True
    )

    class Meta:
        model = models.Bill
        fields = (
            "id",
            "active",
            "bill_type",
            "description",
            "value",
            "observation",
            "due_date",
            "payment_date",
            "category",
            "category_details",
            "status",
            "lawsuit",
            "lawsuit_details",
            "created_at",
            "updated_at",
            "created_by",
        )


class BillValueSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(read_only=True)
    total_in = serializers.DecimalField(max_digits=25, decimal_places=2, read_only=True)
    total_out = serializers.DecimalField(
        max_digits=25, decimal_places=2, read_only=True
    )
    net_income = serializers.DecimalField(
        max_digits=25, decimal_places=2, read_only=True
    )
    bills = BillSerializer(many=True, read_only=True)
