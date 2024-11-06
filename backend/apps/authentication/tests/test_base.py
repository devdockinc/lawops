from rest_framework_simplejwt.tokens import RefreshToken
from django.test import TestCase
from django.contrib.auth import get_user_model


class BaseTestCase(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_superuser(
            username="testuser",
            email="test@test.com",
            password="testpassword",
        )

    def get_tokens(self):
        refresh = RefreshToken.for_user(self.user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
