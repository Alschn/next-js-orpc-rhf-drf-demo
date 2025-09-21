from typing import Any

import jwt
from django.conf import settings
from rest_framework_simplejwt.backends import TokenBackend as BaseTokenBackend


class TokenBackend(BaseTokenBackend):
    def encode(self, payload: dict[str, Any]) -> str:
        """
        Returns an encoded token for the given payload dictionary.
        """

        return jwt.encode(
            self.prepare_payload(payload),
            self.prepared_signing_key,
            algorithm=self.algorithm,
            json_encoder=self.json_encoder,
        )

    def prepare_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Extends the payload with audience and issuer if they are set in the backend.
        """

        jwt_payload = payload.copy()

        jwt_payload["aud"] = self.get_audience(payload)

        if self.issuer is not None:
            jwt_payload["iss"] = self.issuer

        return jwt_payload

    def get_audience(self, payload: dict) -> list[str]:
        """
        Returns a list of audiences merged from global settings and current payload.
        """

        global_audience = self.audience or []
        aud = payload.get("aud", [])

        if isinstance(self.audience, list):
            aud.extend(global_audience)

        elif isinstance(self.audience, str):
            aud += global_audience.replace(" ", "").split(",")

        return list(set(aud))


token_backend = TokenBackend(
    algorithm=settings.SIMPLE_JWT["ALGORITHM"],
    signing_key=settings.SIMPLE_JWT["SIGNING_KEY"],
    verifying_key=settings.SIMPLE_JWT["VERIFYING_KEY"],
    audience=settings.SIMPLE_JWT["AUDIENCE"],
    issuer=settings.SIMPLE_JWT["ISSUER"],
    leeway=settings.SIMPLE_JWT["LEEWAY"],
    json_encoder=None,
)
