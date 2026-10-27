import dataclasses
import typing

from rest_framework.test import APIClient as BaseAPIClient, APITestCase as DRFAPITestCase

from accounts.services.jwt import get_tokens_for_user


class APIClient(BaseAPIClient):
    def login_with_jwt(self, user, **kwargs):
        """
        Set the JWT token in the request headers.
        """
        access, _ = get_tokens_for_user(user)
        self.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")


class APITestCase(DRFAPITestCase):
    client_class = APIClient
    client: APIClient


class ResponseLikeProtocol(typing.Protocol):
    status_code: int

    def json(self) -> dict: ...


@dataclasses.dataclass
class ExceptionDict:
    code: str
    detail: str
    attr: str = None


@dataclasses.dataclass
class ExceptionResponse:
    """
    Dataclass for easier handling of exception responses from the API in unit tests.
    """

    # Content extracted from response JSON.
    type: str
    errors: list[ExceptionDict]

    # Optional response object for additional information.
    _response: ResponseLikeProtocol = None

    @classmethod
    def from_dict(cls, data: dict) -> "ExceptionResponse":
        errors = [ExceptionDict(**error) for error in data["errors"]]
        return cls(
            type=data["type"],
            errors=errors,
        )

    @classmethod
    def from_response(cls, response: ResponseLikeProtocol) -> "ExceptionResponse":
        obj = cls.from_dict(response.json())
        obj._response = response
        return obj

    @property
    def status(self) -> int | None:
        return self._response.status_code if self._response else None

    @property
    def status_code(self) -> int | None:
        return self.status

    @property
    def codes(self) -> list[str]:
        return [error.code for error in self.errors]

    @property
    def details(self) -> list[str]:
        return [error.detail for error in self.errors]

    @property
    def attrs(self) -> list[str]:
        return [error.attr for error in self.errors]

    def get_error_by_code(self, code: typing.Any) -> ExceptionDict:
        for error in self.errors:
            if error.code == str(code):
                return error

        raise ValueError(f'Code "{code}" not found in errors.')

    def get_error_by_attr(self, attr: str) -> ExceptionDict:
        for error in self.errors:
            if error.attr == attr:
                return error

        raise ValueError(f'Attribute "{attr}" not found in errors.')

    def contains_error_code(self, code: typing.Any) -> bool:
        try:
            self.get_error_by_code(code)
            return True
        except ValueError:
            return False

    def contains_error_attr(self, attr: str) -> bool:
        try:
            self.get_error_by_attr(attr)
            return True
        except ValueError:
            return False
