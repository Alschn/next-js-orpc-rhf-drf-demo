import abc

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, mixins, filters, permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework_api_key.permissions import HasAPIKey

from accounts.filters import UsersFilterSet
from accounts.models import User
from accounts.serializers import UserSerializer


class HasUserPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method.lower() == "get":
            return True

        return request.user.is_authenticated and request.user.id == obj.id or request.user.is_superuser


class AbstractUserViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet, abc.ABC
):
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend]
    filterset_class = UsersFilterSet
    search_fields = ("username", "first_name", "last_name")

    def get_queryset(self):
        return User.objects.order_by("-date_joined")

    def get_serializer_class(self):
        return UserSerializer


@extend_schema(tags=["users"])
class UserViewSet(AbstractUserViewSet):
    permission_classes = [HasUserPermission]
    http_method_names = ("get", "patch")


@extend_schema(tags=["internal"])
class InternalUserViewSet(AbstractUserViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [HasAPIKey | IsAdminUser]
    http_method_names = ("get",)
