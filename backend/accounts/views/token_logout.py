import typing

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

if typing.TYPE_CHECKING:
    from rest_framework.request import Request


@extend_schema(tags=["auth"])
class TokenLogoutAPIView(APIView):
    """
    Blacklists all refresh tokens belonging to the current user.
    """

    serializer_class = None

    def post(self, request: "Request", *args: typing.Any, **kwargs: typing.Any) -> Response:
        refresh_tokens = OutstandingToken.objects.filter(user=request.user)
        for refresh in refresh_tokens:
            BlacklistedToken.objects.get_or_create(token=refresh)
        return Response({}, status=status.HTTP_200_OK)
