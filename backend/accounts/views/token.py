from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.serializers.jwt import JWTObtainPairSerializer


@extend_schema(tags=["auth"])
class TokenObtainPairAPIView(TokenObtainPairView):
    serializer_class = JWTObtainPairSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
