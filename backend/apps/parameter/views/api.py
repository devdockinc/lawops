from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.authentication.permissions import CustomDjangoModelPermissions
from apps.parameter.models import Parameter
from apps.parameter.serializers import ParameterSerializer


class ParameterViewSet(viewsets.ModelViewSet):
    queryset = Parameter.objects.all()  # type: ignore
    serializer_class = ParameterSerializer

    permission_classes = [
        IsAuthenticated,
        CustomDjangoModelPermissions,
    ]
