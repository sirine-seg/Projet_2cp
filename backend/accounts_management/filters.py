import django_filters
from .models import User, Technicien


class UserFilter(django_filters.FilterSet):
    """
    Filter for User model to filter by role.
    """
    role = django_filters.ChoiceFilter(choices=User.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ['role']


class TechnicienFilter(django_filters.FilterSet):
    """
    Filter for Technicien model to filter by poste and disponibilite.
    """
    poste__nom = django_filters.CharFilter(
        lookup_expr='icontains')
    disponibilite = django_filters.BooleanFilter()

    class Meta:
        model = Technicien
        fields = ['poste__nom', 'disponibilite']
