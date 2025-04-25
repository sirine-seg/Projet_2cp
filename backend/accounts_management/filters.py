import django_filters
from .models import User, Admin, Technicien, Personnel, Poste


class UserFilter(django_filters.FilterSet):
    role = django_filters.CharFilter(lookup_expr='icontains')
    email = django_filters.CharFilter(lookup_expr='icontains')
    first_name = django_filters.CharFilter(lookup_expr='icontains')
    last_name = django_filters.CharFilter(lookup_expr='icontains')
    numero_tel = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = User
        fields = ['role', 'email', 'first_name', 'last_name', 'numero_tel']


class AdminFilter(django_filters.FilterSet):
    user__email = django_filters.CharFilter(lookup_expr='icontains')
    user__first_name = django_filters.CharFilter(lookup_expr='icontains')
    user__last_name = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Admin
        fields = ['user__email', 'user__first_name', 'user__last_name']


class TechnicienFilter(django_filters.FilterSet):
    user__email = django_filters.CharFilter(lookup_expr='icontains')
    user__first_name = django_filters.CharFilter(lookup_expr='icontains')
    user__last_name = django_filters.CharFilter(lookup_expr='icontains')
    disponibilite = django_filters.BooleanFilter()
    poste = django_filters.ModelChoiceFilter(queryset=Poste.objects.all())

    class Meta:
        model = Technicien
        fields = ['user__email', 'user__first_name',
                  'user__last_name', 'disponibilite', 'poste']


class PersonnelFilter(django_filters.FilterSet):
    user__email = django_filters.CharFilter(lookup_expr='icontains')
    user__first_name = django_filters.CharFilter(lookup_expr='icontains')
    user__last_name = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Personnel
        fields = ['user__email', 'user__first_name', 'user__last_name']
