from rest_framework.pagination import LimitOffsetPagination as BaseLimitOffsetPagination

MAX_PAGE_SIZE = 100


class LimitOffsetPagination(BaseLimitOffsetPagination):
    max_limit = MAX_PAGE_SIZE
