import django_filters
from .models import User


class UserFilter(django_filters.FilterSet):
    """Filter for User model to search and filter by various fields"""
    role = django_filters.ChoiceFilter(choices=User.ROLE_CHOICES)
    first_name = django_filters.CharFilter(lookup_expr='icontains')
    last_name = django_filters.CharFilter(lookup_expr='icontains')
    email = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = User
        fields = ['role', 'first_name', 'last_name', 'email']
