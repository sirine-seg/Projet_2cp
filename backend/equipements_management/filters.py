import django_filters
from .models import Equipement


class EquipementFilter(django_filters.FilterSet):
    categorie__nom = django_filters.CharFilter(
        lookup_expr='icontains')
    typee__nom = django_filters.CharFilter(
        lookup_expr='icontains')
    localisation__nom = django_filters.CharFilter(
        lookup_expr='icontains')
    etat__nom = django_filters.CharFilter(
        lookup_expr='icontains')

    class Meta:
        model = Equipement
        fields = [
            'categorie__nom',
            'typee__nom',
            'localisation__nom',
            'etat__nom',
        ]
