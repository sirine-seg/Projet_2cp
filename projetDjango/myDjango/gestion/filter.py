import django_filters
from .models import Equipement



class EquipementFilter(django_filters.FilterSet):
    categorie = django_filters.CharFilter(field_name="categorie", lookup_expr='icontains')
    etat = django_filters.CharFilter(field_name="etat", lookup_expr='icontains')
    localisation= django_filters.CharFilter(field_name="localisation", lookup_expr='icontains')
    date_ajou= django_filters.CharFilter(field_name="date_ajou", lookup_expr='icontains')
    type= django_filters.CharFilter(field_name="type", lookup_expr='icontains')
    

    class Meta:
        model = Equipement
        fields = ['categorie', 'type','localisation','etat']

