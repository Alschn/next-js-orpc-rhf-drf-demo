import typing

import jwt
from django.conf import settings
from django.urls import reverse_lazy
from rest_framework import status
from rest_framework_simplejwt.state import token_backend
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from accounts.models import User
from accounts.services.jwt.tokens import get_tokens_for_user
from core.shared.factories import UserFactory, DEFAULT_USER_FACTORY_PASSWORD
from core.shared.tests import APITestCase, ExceptionResponse


class JWTAuthViewsTests(APITestCase):
    token_obtain_url = reverse_lazy("accounts:token_obtain_pair")
    token_refresh_url = reverse_lazy("accounts:token_refresh")
    token_verify_url = reverse_lazy("accounts:token_verify")
    token_logout_url = reverse_lazy("accounts:token_logout")

    @classmethod
    def setUpTestData(cls):
        cls.user = typing.cast(User, UserFactory(username="test", email="test@example.com"))

    def test_obtain_jwt(self):
        response = self.client.post(
            self.token_obtain_url,
            {
                "username": self.user.username,
                "password": DEFAULT_USER_FACTORY_PASSWORD,
            },
        )
        res_json = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", res_json)
        self.assertIn("refresh", res_json)

        expected_algorithm = settings.SIMPLE_JWT["ALGORITHM"]
        expected_access_token_type = "access"
        expected_refresh_token_type = "refresh"
        expected_sub = str(self.user.id)
        expected_email = self.user.email
        expected_first_name = self.user.first_name
        expected_last_name = self.user.last_name
        expected_aud = settings.SIMPLE_JWT["AUDIENCE"]
        expected_iss = settings.SIMPLE_JWT["ISSUER"]

        access_token = res_json["access"]
        access_header = jwt.get_unverified_header(access_token)
        self.assertEqual(access_header["alg"], expected_algorithm)

        access = token_backend.decode(access_token)
        self.assertEqual(access["token_type"], expected_access_token_type)
        self.assertEqual(access["sub"], expected_sub)
        self.assertEqual(access["email"], expected_email)
        self.assertEqual(access["first_name"], expected_first_name)
        self.assertEqual(access["last_name"], expected_last_name)
        self.assertEqual(access["iss"], expected_iss)
        self.assertEqual(sorted(access["aud"]), sorted(expected_aud or []))
        self.assertIn("iat", access)
        self.assertIn("exp", access)

        refresh_token = res_json["refresh"]
        refresh_header = jwt.get_unverified_header(refresh_token)
        self.assertEqual(refresh_header["alg"], expected_algorithm)

        refresh = token_backend.decode(refresh_token)
        self.assertEqual(refresh["token_type"], expected_refresh_token_type)
        self.assertEqual(refresh["sub"], expected_sub)
        self.assertEqual(refresh["email"], expected_email)
        self.assertEqual(refresh["first_name"], expected_first_name)
        self.assertEqual(refresh["last_name"], expected_last_name)
        self.assertEqual(refresh["iss"], expected_iss)
        self.assertEqual(sorted(refresh["aud"]), sorted(expected_aud or []))
        self.assertIn("iat", refresh)
        self.assertIn("exp", refresh)

    def test_obtain_jwt_missing_fields(self):
        response = self.client.post(
            self.token_obtain_url,
            {
                "email": "test@gmail.com",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        res = ExceptionResponse.from_response(response)
        username_err = res.get_error_by_attr("username")
        password_err = res.get_error_by_attr("password")
        self.assertEqual(username_err.code, "required")
        self.assertEqual(password_err.code, "required")

    def test_obtain_jwt_user_not_found(self):
        response = self.client.post(self.token_obtain_url, {"username": "nouser", "password": "nouser123"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        res = ExceptionResponse.from_response(response)
        self.assertTrue(res.contains_error_code("no_active_account"))

    def test_refresh_jwt_refresh_in_request(self):
        old_access, refresh = get_tokens_for_user(self.user)
        response = self.client.post(self.token_refresh_url, data={"refresh": refresh})
        response_json = response.json()
        new_access = response_json["access"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response_json)
        self.assertNotEqual(old_access, new_access)

        # check if refresh and access tokens share same payload
        decoded_refresh = token_backend.decode(refresh)
        decoded_access = token_backend.decode(new_access)
        self.assertEqual(decoded_access["sub"], decoded_refresh["sub"])
        self.assertEqual(decoded_access["email"], decoded_refresh["email"])
        self.assertEqual(decoded_access["first_name"], decoded_refresh["first_name"])
        self.assertEqual(decoded_access["last_name"], decoded_refresh["last_name"])
        self.assertEqual(decoded_access["iss"], decoded_refresh["iss"])
        self.assertEqual(sorted(decoded_access["aud"]), sorted(decoded_refresh["aud"]))

    def test_refresh_jwt_missing_fields(self):
        response = self.client.post(self.token_refresh_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        res = ExceptionResponse.from_response(response)
        refresh_err = res.get_error_by_attr("refresh")
        self.assertEqual(refresh_err.code, "required")

        response = self.client.post(self.token_refresh_url, {"refresh": ""})
        res = ExceptionResponse.from_response(response)
        refresh_err = res.get_error_by_attr("refresh")
        self.assertEqual(refresh_err.code, "blank")

    def test_refresh_jwt_invalid_refresh(self):
        response = self.client.post(self.token_refresh_url, {"refresh": "blablablablabla"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        err = ExceptionResponse.from_response(response)
        self.assertTrue(err.contains_error_code("token_not_valid"))

    def test_verify_jwt_token_in_request(self):
        access, refresh = get_tokens_for_user(self.user)
        res_verify_access = self.client.post(self.token_verify_url, {"token": access})
        self.assertEqual(res_verify_access.status_code, status.HTTP_200_OK)
        self.assertEqual(res_verify_access.json(), {})

        res_verify_refresh = self.client.post(self.token_verify_url, {"token": refresh})
        self.assertEqual(res_verify_refresh.status_code, status.HTTP_200_OK)
        self.assertEqual(res_verify_refresh.json(), {})

    def test_verify_jwt_token_invalid(self):
        response = self.client.post(self.token_verify_url, {"token": "totally_legit_jwt"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        err = ExceptionResponse.from_response(response)
        self.assertTrue(err.contains_error_code("token_not_valid"))

    def test_logout_jwt(self):
        access, refresh = get_tokens_for_user(self.user)
        token = OutstandingToken.objects.get(user=self.user)

        with self.assertRaises(BlacklistedToken.DoesNotExist):
            BlacklistedToken.objects.get(token=token)

        response = self.client.post(self.token_logout_url, HTTP_AUTHORIZATION=f"Bearer {access}")
        blacklisted_token = BlacklistedToken.objects.get(token=token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(blacklisted_token.token, token)

        refresh_response = self.client.post(self.token_refresh_url, {"refresh": refresh})
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)
        refresh_res = ExceptionResponse.from_response(refresh_response)
        self.assertTrue(refresh_res.contains_error_code("token_not_valid"))

    def test_logout_unauthorized(self):
        response = self.client.post(self.token_logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        res = ExceptionResponse.from_response(response)
        self.assertTrue(res.contains_error_code("not_authenticated"))
