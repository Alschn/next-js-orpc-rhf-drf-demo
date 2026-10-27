from rest_framework_simplejwt.tokens import AccessToken as BaseAccessToken, RefreshToken as BaseRefreshToken
from rest_framework_simplejwt.serializers import AuthUser
from rest_framework_simplejwt.tokens import Token

from accounts.services.jwt.backend import token_backend


class AccessToken(BaseAccessToken):
    _token_backend = token_backend


class RefreshToken(BaseRefreshToken):
    _token_backend = token_backend
    access_token_class = AccessToken


def get_token_for_user(user: AuthUser) -> Token:
    token = RefreshToken.for_user(user)
    token["email"] = user.email
    token["username"] = user.username
    token["first_name"] = user.first_name
    token["last_name"] = user.last_name
    return token


def get_tokens_for_user(user: AuthUser) -> tuple[str, str]:
    """
    Returns access and refresh token pair.
    access, refresh = get_tokens_for_user(user)
    """
    token = get_token_for_user(user)
    access = str(token.access_token)  # type: ignore
    refresh = str(token)
    return access, refresh
