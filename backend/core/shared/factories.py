import factory
from factory.django import DjangoModelFactory

DEFAULT_USER_FACTORY_PASSWORD = "test"


class UserFactory(DjangoModelFactory):
    class Meta:
        model = "accounts.User"

    username = factory.Faker("user_name")
    email = factory.Faker("email")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = factory.PostGenerationMethodCall("set_password", DEFAULT_USER_FACTORY_PASSWORD)
    is_active = True
    is_staff = factory.Faker("boolean", chance_of_getting_true=0.1)
