from apps.authentication.tests.test_base import BaseTestCase


class APIV1EndpointsTests(BaseTestCase):
    def test_user_list_endpoint_without_token(self):
        response = self.client.get("/api/v1/user/")
        self.assertEqual(response.status_code, 401)

    def test_user_list_endpoint_with_token(self):
        tokens = self.get_tokens()
        response = self.client.get(
            "/api/v1/user/", HTTP_AUTHORIZATION=f"Bearer {tokens['access']}"
        )
        self.assertEqual(response.status_code, 200)

    def test_user_detail_endpoint_without_token(self):
        response = self.client.get(f"/api/v1/user/{self.user.id}/")
        self.assertEqual(response.status_code, 401)

    def test_user_detail_endpoint_with_token(self):
        tokens = self.get_tokens()
        response = self.client.get(
            f"/api/v1/user/{self.user.id}/",
            HTTP_AUTHORIZATION=f"Bearer {tokens['access']}",
        )
        self.assertEqual(response.status_code, 200)

    def test_user_creation_endpoint(self):
        data = {
            "username": "testuser2",
            "email": "test2@test.com",
            "password": "testpassword",
        }
        tokens = self.get_tokens()
        response = self.client.post(
            "/api/v1/user/", data, HTTP_AUTHORIZATION=f"Bearer {tokens['access']}"
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["username"], data["username"])
        self.assertEqual(response.data["email"], data["email"])
