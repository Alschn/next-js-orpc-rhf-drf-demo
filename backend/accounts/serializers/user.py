from rest_framework import serializers

from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(allow_blank=False)
    last_name = serializers.CharField(allow_blank=False)

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "is_active", "is_staff")
        extra_kwargs = {
            "username": {"read_only": True},
            "email": {"read_only": True},
            "is_active": {"read_only": True},
            "is_staff": {"read_only": True},
        }
