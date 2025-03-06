import django_filters
from gestion.models import  Equipement

class EquipementFilter(django_filters.FilterSet):
    class Meta:
        model = Equipement
        fields = {
            'categorie': ['exact'],
            'etat': ['exact'],
            'localisation': ['exact'],
        }
        