from rest_framework import filters
from django_filters import rest_framework as django_filters
from django.db.models import Q
from datetime import datetime
from .models import Intervention, Status 




class InterventionFilter(django_filters.FilterSet):
    """
    Filter set for Intervention model.
    
    Provides filtering by equipment, personnel, technician, status,
    urgency, date ranges, and more.
    """
    # Equipment filters
    equipment_id = django_filters.NumberFilter(field_name='id_equipement__id_equipement')
    equipment_name = django_filters.CharFilter(field_name='id_equipement__nom', lookup_expr='icontains')
    equipment_category = django_filters.CharFilter(field_name='id_equipement__categorie', lookup_expr='icontains')
    
    # Personnel filters
    personnel_email = django_filters.CharFilter(field_name='id_personnel__user__email', lookup_expr='icontains')
    personnel_name = django_filters.CharFilter(method='filter_personnel_name')
    
    # Technician filters
    technician_email = django_filters.CharFilter(field_name='id_technicien__user__email', lookup_expr='icontains')
    technician_name = django_filters.CharFilter(method='filter_technician_name')
    
    # Admin filters
    admin_email = django_filters.CharFilter(field_name='id_admin__user__email', lookup_expr='icontains')
    
    # Status filters
    status = django_filters.ModelChoiceFilter(queryset=Status.objects.all())
    status_name = django_filters.CharFilter(field_name='statut__nom', lookup_expr='icontains')
    
    # Urgency filter
    urgency = django_filters.ChoiceFilter(choices=Intervention.URGENCE_CHOICES)
    
    # Date filters
    date_debut_after = django_filters.DateTimeFilter(field_name='date_debut', lookup_expr='gte')
    date_debut_before = django_filters.DateTimeFilter(field_name='date_debut', lookup_expr='lte')
    date_fin_after = django_filters.DateTimeFilter(field_name='date_fin', lookup_expr='gte')
    date_fin_before = django_filters.DateTimeFilter(field_name='date_fin', lookup_expr='lte')
    
    # Special filters
    is_active = django_filters.BooleanFilter(method='filter_is_active')
    is_overdue = django_filters.BooleanFilter(method='filter_is_overdue')
    search = django_filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Intervention
        fields = [
            'equipment_id', 'equipment_name', 'equipment_category',
            'personnel_email', 'personnel_name',
            'technician_email', 'technician_name',
            'admin_email',
            'status', 'status_name',
            'urgency',
            'date_debut_after', 'date_debut_before',
            'date_fin_after', 'date_fin_before',
            'is_active', 'is_overdue',
            'search',
        ]
    
    def filter_personnel_name(self, queryset, name, value):
        """Filter by personnel first or last name"""
        return queryset.filter(
            Q(id_personnel__user__first_name__icontains=value) |
            Q(id_personnel__user__last_name__icontains=value)
        )
    
    def filter_technician_name(self, queryset, name, value):
        """Filter by technician first or last name"""
        return queryset.filter(
            Q(id_technicien__user__first_name__icontains=value) |
            Q(id_technicien__user__last_name__icontains=value)
        )
    
    def filter_is_active(self, queryset, name, value):
        """Filter for active interventions (not completed)"""
        active_statuses = Status.objects.exclude(nom__in=['Terminé', 'Annulé'])
        if value:
            return queryset.filter(statut__in=active_statuses)
        else:
            return queryset.exclude(statut__in=active_statuses)
    
    def filter_is_overdue(self, queryset, name, value):
        """Filter for overdue interventions (past end date and not completed)"""
        now = datetime.now()
        active_statuses = Status.objects.exclude(nom__in=['Terminé', 'Annulé']) 
        if value:
            return queryset.filter(date_fin__lt=now, statut__in=active_statuses)
        else:
            return queryset.exclude(date_fin__lt=now, statut__in=active_statuses)
    
    def filter_search(self, queryset, name, value):
        """Global search across multiple fields"""
        return queryset.filter(
            Q(description__icontains=value) |
            Q(id_equipement__nom__icontains=value) |
            Q(id_personnel__user__email__icontains=value) |
            Q(id_personnel__user__first_name__icontains=value) |
            Q(id_personnel__user__last_name__icontains=value) |
            Q(id_technicien__user__email__icontains=value) |
            Q(id_technicien__user__first_name__icontains=value) |
            Q(id_technicien__user__last_name__icontains=value) |
            Q(statut__nom__icontains=value)
        )