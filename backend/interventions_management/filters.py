import django_filters
from .models import InterventionPreventive, InterventionCurrative


class InterventionPreventiveFilter(django_filters.FilterSet):
    """
    Filter for InterventionPreventive.
    """
    equipement = django_filters.CharFilter(
        field_name="equipement__nom", lookup_expr="icontains")
    technicien = django_filters.CharFilter(
        field_name="technicien__user__email", lookup_expr="icontains")
    admin = django_filters.CharFilter(
        field_name="admin__user__email", lookup_expr="icontains")
    statut = django_filters.CharFilter(
        field_name="statut__name", lookup_expr="icontains")
    urgence = django_filters.NumberFilter(field_name="urgence")
    date_debut = django_filters.DateFromToRangeFilter(field_name="date_debut")
    period = django_filters.DurationFilter(field_name="period")

    class Meta:
        model = InterventionPreventive
        fields = ['equipement', 'technicien', 'admin',
                  'statut', 'urgence', 'date_debut', 'period']


class InterventionCurrativeFilter(django_filters.FilterSet):
    """
    Filter for InterventionCurrative.
    """
    equipement = django_filters.CharFilter(
        field_name="equipement__nom", lookup_expr="icontains")
    technicien = django_filters.CharFilter(
        field_name="technicien__user__email", lookup_expr="icontains")
    admin = django_filters.CharFilter(
        field_name="admin__user__email", lookup_expr="icontains")
    statut = django_filters.CharFilter(
        field_name="statut__name", lookup_expr="icontains")
    urgence = django_filters.NumberFilter(field_name="urgence")
    date_debut = django_filters.DateFromToRangeFilter(field_name="date_debut")
    date_fin = django_filters.DateFromToRangeFilter(field_name="date_fin")
    user = django_filters.CharFilter(
        field_name="user__user__email", lookup_expr="icontains")

    class Meta:
        model = InterventionCurrative
        fields = ['equipement', 'technicien', 'admin', 'statut',
                  'urgence', 'date_debut', 'date_fin', 'user']


class InterventionFilter(django_filters.FilterSet):
    """
    Filter for all interventions (both preventive and currative).
    Includes a custom filter to distinguish between types.
    """
    type = django_filters.CharFilter(
        method='filter_by_type', label="Type of Intervention")

    class Meta:
        fields = ['type']

    def filter_by_type(self, queryset, name, value):
        """
        Custom filter to distinguish between preventive and currative interventions.
        """
        if value.lower() == "preventive":
            return queryset.filter(interventionpreventive__isnull=False)
        elif value.lower() == "currative":
            return queryset.filter(interventioncurrative__isnull=False)
        return queryset