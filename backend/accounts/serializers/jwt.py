from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    AuthUser,
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
    TokenVerifySerializer,
)

from accounts.services.jwt import get_token_for_user


class JWTObtainPairSerializer(TokenObtainPairSerializer):
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    username_field = "username"

    @classmethod
    def get_token(cls, user: AuthUser):
        return get_token_for_user(user)


class JWTRefreshSerializer(TokenRefreshSerializer):
    pass


class JWTVerifySerializer(TokenVerifySerializer):
    pass
