from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authentication.permissions import CustomDjangoModelPermissions
from apps.lawsuit import models, serializers


class LawsuitViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "patch", "options", "head"]

    queryset = models.Lawsuit.objects.all()
    serializer_class = serializers.LawsuitSerializer
    permission_classes = [
        CustomDjangoModelPermissions,
        IsAuthenticated,
    ]

    filterset_fields = (
        "cnj_number",
        "automatic_update",
    )


class LawsuitCommentViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "options", "head"]

    queryset = models.LawsuitComment.objects.all()
    serializer_class = serializers.LawsuitCommentSerializer
    permission_classes = [
        CustomDjangoModelPermissions,
        IsAuthenticated,
    ]

    filterset_fields = (
        "lawsuit",
        "created_by",
    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, many=False, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data)
