import django_filters
from .models import InterventionRecord
from django.db.models import Q

class InterventionRecordFilter(django_filters.FilterSet):
    # Date filters for intervention date
    start_date = django_filters.DateTimeFilter(field_name='intervention__date_debut', lookup_expr='gte')
    end_date = django_filters.DateTimeFilter(field_name='intervention__date_debut', lookup_expr='lte')
    
    # Equipment filter (through the intervention relationship)
    equipement = django_filters.NumberFilter(field_name='intervention__id_equipement__id_equipement')
    
    # Technician filter (through the intervention relationship)
    technicien = django_filters.NumberFilter(field_name='intervention__id_technicien__user__id')
    
    # Text search across multiple fields
    search = django_filters.CharFilter(method='search_filter')

    class Meta:
        model = InterventionRecord
        fields = ['type_maintenance', 'intervention__statut']
    
    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(actions_effectuees__icontains=value) |
            Q(pieces_remplacees__icontains=value) |
            Q(intervention__description__icontains=value)
        )