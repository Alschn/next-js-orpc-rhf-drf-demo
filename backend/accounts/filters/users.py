import django_filters as filters

from accounts.models import User


class UsersFilterSet(filters.FilterSet):
    class Meta:
        model = User
        fields = {
            "is_active": ["exact"],
            "is_staff": ["exact"],
        }
