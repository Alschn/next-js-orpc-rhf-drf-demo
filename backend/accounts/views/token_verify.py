from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenVerifyView

from accounts.serializers.jwt import JWTVerifySerializer


@extend_schema(tags=["auth"])
class TokenVerifyAPIView(TokenVerifyView):
    serializer_class = JWTVerifySerializer
    permission_classes = [AllowAny]
    authentication_classes = []
