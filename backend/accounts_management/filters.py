import django_filters
from .models import User, Technicien,Poste

class UserFilter(django_filters.FilterSet):
    """
    Filter for User model to filter by role and poste.
    """
    role = django_filters.ChoiceFilter(choices=User.ROLE_CHOICES)
    poste = django_filters.ModelChoiceFilter(queryset=Poste.objects.all(), field_name='technicien__poste')
    disponibilite = django_filters.BooleanFilter(field_name='technicien__disponibilite')

    class Meta:
        model = User
        fields = ['role', 'poste']


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