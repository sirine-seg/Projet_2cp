from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction

from accounts_management.permissions import IsAdmin, IsPersonnel, IsTechnician
from equipements_management.models import Equipement
from .models import (
    StatusIntervention,
    Intervention,
    InterventionPreventive,
    InterventionCurrative
)
from .serializers import (
    StatusInterventionSerializer,
    InterventionSerializer,
    InterventionPreventiveSerializer,
    AdminInterventionCurrativeSerializer,
    UserInterventionCurrativeSerializer
)
from .filters import (
    InterventionPreventiveFilter,
    InterventionCurrativeFilter
)


class StatusInterventionListCreateView(generics.ListCreateAPIView):
    """
    View to list all intervention statuses and create new ones.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class StatusInterventionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update or delete an intervention status.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class InterventionPreventiveListCreateView(generics.ListCreateAPIView):
    """
    View to list and create preventive interventions.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = InterventionPreventiveFilter

    def get_queryset(self):
        """
        Filter queryset based on user role.
        """
        user = self.request.user
        queryset = super().get_queryset()

        if IsAdmin().has_permission(self.request, self):
            return queryset
        elif IsTechnician().has_permission(self.request, self):
            return queryset.filter(intervention__technicien=user.technicien)

        return InterventionPreventive.objects.none()


class InterventionPreventiveDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update or delete a preventive intervention.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'intervention_id'

    def get_queryset(self):
        """
        Filter queryset based on user role.
        """
        user = self.request.user
        queryset = super().get_queryset()

        if IsAdmin().has_permission(self.request, self):
            return queryset
        elif IsTechnician().has_permission(self.request, self):
            return queryset.filter(intervention__technicien=user.technicien)

        return InterventionPreventive.objects.none()


class AdminInterventionCurrativeListCreateView(generics.ListCreateAPIView):
    """
    View for admins to list and create currative interventions.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = InterventionCurrativeFilter


class AdminInterventionCurrativeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View for admins to retrieve, update or delete a currative intervention.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'intervention_id'


class PersonnelInterventionCurrativeListView(generics.ListAPIView):
    """
    View for personnel to list their currative interventions.
    """
    serializer_class = AdminInterventionCurrativeSerializer  # Using full serializer for read
    permission_classes = [IsPersonnel, IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = InterventionCurrativeFilter

    def get_queryset(self):
        """
        Filter to only show interventions created by the current user.
        """
        return InterventionCurrative.objects.filter(user=self.request.user.personnel)


class PersonnelInterventionCurrativeCreateView(generics.CreateAPIView):
    """
    View for personnel to create a currative intervention.
    """
    serializer_class = UserInterventionCurrativeSerializer
    permission_classes = [IsPersonnel, IsAuthenticated]

    def perform_create(self, serializer):
        """
        Set the user to the current user.
        """
        serializer.save()


class TechnicianInterventionListView(generics.ListAPIView):
    """
    View for technicians to list interventions assigned to them.
    """
    permission_classes = [IsTechnician, IsAuthenticated]

    def get_serializer_class(self):
        intervention_type = self.request.query_params.get('type')
        if intervention_type == Intervention.TYPE_PREVENTIVE:
            return InterventionPreventiveSerializer
        return AdminInterventionCurrativeSerializer

    def get_queryset(self):
        """
        Filter to only show interventions assigned to the current technician.
        """
        user = self.request.user
        intervention_type = self.request.query_params.get('type')

        if intervention_type == Intervention.TYPE_PREVENTIVE:
            return InterventionPreventive.objects.filter(
                intervention__technicien=user.technicien
            )
        else:
            return InterventionCurrative.objects.filter(
                intervention__technicien=user.technicien
            )


class AllInterventionsListView(generics.ListAPIView):
    """
    View to list all interventions (both preventive and currative).
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Custom list method to combine different types of interventions."""
        user = request.user

        # Base query for interventions
        interventions = Intervention.objects.all()

        # Filter based on user role
        if hasattr(user, 'admin'):
            # Admin sees everything
            pass
        elif hasattr(user, 'personnel'):
            # Personnel sees only their currative interventions
            interventions = interventions.filter(
                currative_details__user=user.personnel
            )
        elif hasattr(user, 'technicien'):
            # Technician sees only interventions they're assigned to
            interventions = interventions.filter(
                technicien=user.technicien
            )
        else:
            return Response({"detail": "User role not identified"},
                            status=status.HTTP_403_FORBIDDEN)

        # Prepare result data
        result = []
        for intervention in interventions:
            # Base intervention data
            intervention_data = {
                'id_intervention': intervention.id_intervention,
                'type_intervention': intervention.type_intervention,
                'title': intervention.title,
                'equipement_id': intervention.equipement_id,
                'equipement': str(intervention.equipement),
                'technicien': [
                    {
                        'id': t.id,
                        'name': f"{t.user.first_name} {t.user.last_name}"
                    }
                    for t in intervention.technicien.all()
                ],
                'admin_id': intervention.admin_id,
                'urgence': intervention.urgence,
                'date_debut': intervention.date_debut,
                'statut_id': intervention.statut_id,
                'statut': str(intervention.statut) if intervention.statut else None,
                'blocked': intervention.blocked,
                'description': intervention.description,
                'notes': intervention.notes,
            }

            # Add type-specific data
            if intervention.type_intervention == Intervention.TYPE_PREVENTIVE:
                try:
                    preventive = intervention.preventive_details
                    intervention_data['period'] = preventive.period
                except InterventionPreventive.DoesNotExist:
                    pass

            elif intervention.type_intervention == Intervention.TYPE_CURRATIVE:
                try:
                    currative = intervention.currative_details
                    intervention_data['user_id'] = currative.user_id
                    intervention_data['user'] = str(
                        currative.user) if currative.user else None
                    intervention_data['date_fin'] = currative.date_fin
                except InterventionCurrative.DoesNotExist:
                    pass

            result.append(intervention_data)

        return Response(result)


class InterventionStatsView(generics.GenericAPIView):
    """
    View to get statistics about interventions.
    """
    permission_classes = [IsAdmin, IsAuthenticated]

    def get(self, request):
        """
        Return statistics about interventions.
        """
        total_interventions = Intervention.objects.count()
        preventive_count = InterventionPreventive.objects.count()
        currative_count = InterventionCurrative.objects.count()
        pending_count = Intervention.objects.filter(
            statut__name='En attente').count()
        in_progress_count = Intervention.objects.filter(
            statut__name='En cours').count()
        completed_count = Intervention.objects.filter(
            statut__name='Terminé').count()

        return Response({
            'total': total_interventions,
            'preventive': preventive_count,
            'currative': currative_count,
            'pending': pending_count,
            'in_progress': in_progress_count,
            'completed': completed_count
        })
