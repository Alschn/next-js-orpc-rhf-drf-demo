from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter

from accounts.views import (
    UserViewSet,
    InternalUserViewSet,
    TokenObtainPairAPIView,
    TokenRefreshAPIView,
    TokenVerifyAPIView,
    TokenLogoutAPIView,
)

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

internal_router = SimpleRouter()
internal_router.register("users", InternalUserViewSet, basename="internal-users")

urlpatterns = [
    *router.urls,
    path("auth/token/", TokenObtainPairAPIView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshAPIView.as_view(), name="token_refresh"),
    path("auth/token/verify/", TokenVerifyAPIView.as_view(), name="token_verify"),
    path("auth/token/logout/", TokenLogoutAPIView.as_view(), name="token_logout"),
    path("internal/", include(internal_router.urls)),
]
