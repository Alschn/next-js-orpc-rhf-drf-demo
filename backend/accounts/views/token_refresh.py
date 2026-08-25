from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.serializers import JWTRefreshSerializer


@extend_schema(tags=["auth"])
class TokenRefreshAPIView(TokenRefreshView):
    serializer_class = JWTRefreshSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
