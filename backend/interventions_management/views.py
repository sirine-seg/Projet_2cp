from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from .models import InterventionPreventive, InterventionCurrative, Equipement, StatusIntervention
from .serializers import (
    InterventionPreventiveSerializer,
    AdminInterventionCurrativeSerializer,
    UserInterventionCurrativeSerializer,
    AllInterventionsSerializer,
)
from .filters import InterventionPreventiveFilter, InterventionCurrativeFilter, AllInterventionsFilter
from accounts_management.permissions import IsAdmin, IsPersonnel, IsTechnician
from rest_framework.permissions import IsAuthenticated
from .signals import handle_intervention_status_and_equipement_state


class InterventionPreventiveListView(generics.ListAPIView):
    """
    View to list all preventive interventions.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = InterventionPreventiveFilter
    permission_classes = [IsAdmin | IsTechnician, IsAuthenticated]

    def get_queryset(self):
        """
        Filter queryset based on user role.
        """
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):  # Admin user
            return self.queryset
        elif IsTechnician().has_permission(self.request, self):  # Technician user
            return self.queryset.filter(technicien=user.technicien)
        return self.queryset.none()


class InterventionCurrativeListView(generics.ListAPIView):
    """
    View to list all currative interventions.
    """
    queryset = InterventionCurrative.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = InterventionCurrativeFilter
    permission_classes = [IsAdmin | IsPersonnel |
                          IsTechnician, IsAuthenticated]

    def get_queryset(self):
        """
        Filter queryset based on user role.
        """
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):  # Admin user
            return self.queryset
        elif IsPersonnel().has_permission(self.request, self):  # Personnel user
            return self.queryset.filter(user=user)
        elif IsTechnician().has_permission(self.request, self):  # Technician user
            return self.queryset.filter(technicien=user.technicien)
        return self.queryset.none()

    def get_serializer_class(self):
        """
        Return the appropriate serializer based on user role.
        """
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):  # Admin user
            return AdminInterventionCurrativeSerializer
        return UserInterventionCurrativeSerializer


class AllInterventionsListView(generics.ListAPIView):
    permission_classes = [IsAdmin | IsPersonnel |
                          IsTechnician, IsAuthenticated]
    serializer_class = AllInterventionsSerializer

    def get_queryset(self):
        common_fields = [
            'id_intervention', 'title', 'equipement_id', 'admin_id', 'urgence', 'date_debut', 'statut_id', 'blocked', 'description', 'notes'
        ]

        preventive = InterventionPreventive.objects.all().values(
            *common_fields, 'period'
        )

        currative = InterventionCurrative.objects.all().values(
            *common_fields, 'user_id', 'date_fin'
        )

        for item in preventive:
            item['type'] = 'preventive'
            if item['equipement_id']:
                try:
                    equip = Equipement.objects.get(
                        id_equipement=item['equipement_id'])
                    item['equipement'] = str(equip)
                except Equipement.DoesNotExist:
                    item['equipement'] = f"Unknown ({item['equipement_id']})"
            else:
                item['equipement'] = "None"

            if item['statut_id']:
                try:
                    status = StatusIntervention.objects.get(
                        id=item['statut_id'])
                    item['statut'] = status.name
                except StatusIntervention.DoesNotExist:
                    item['statut'] = f"Unknown ({item['statut_id']})"
            else:
                item['statut'] = "None"

        for item in currative:
            item['type'] = 'currative'
            if item['equipement_id']:
                try:
                    equip = Equipement.objects.get(
                        id_equipement=item['equipement_id'])
                    item['equipement'] = str(equip)
                except Equipement.DoesNotExist:
                    item['equipement'] = f"Unknown ({item['equipement_id']})"
            else:
                item['equipement'] = "None"

            if item['statut_id']:
                try:
                    status = StatusIntervention.objects.get(
                        id=item['statut_id'])
                    item['statut'] = status.name
                except StatusIntervention.DoesNotExist:
                    item['statut'] = f"Unknown ({item['statut_id']})"
            else:
                item['statut'] = "None"

        combined_queryset = list(preventive) + list(currative)

        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return combined_queryset
        elif IsPersonnel().has_permission(self.request, self):
            return [item for item in combined_queryset if
                    (item.get('user_id') == user.id if 'user_id' in item else False)]
        elif IsTechnician().has_permission(self.request, self):
            return [item for item in combined_queryset if
                    (item.get('technicien_id') == user.technicien.id if 'technicien_id' in item else False)]
        return []


class UserInterventionCreateAPI(generics.CreateAPIView):
    """
    API endpoint for users to create a new intervention.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = UserInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """
        Automatically assign the logged-in user to the intervention.
        """
        # Save the instance first
        instance = serializer.save(user=self.request.user)
        # Then call the handler with the required arguments
        handle_intervention_status_and_equipement_state(
            sender=self.__class__, instance=instance, created=True)


class AdminInterventionCreateAPI(generics.CreateAPIView):
    """
    API endpoint for admins to create a new intervention.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAdmin, IsAuthenticated]

    def perform_create(self, serializer):
        """
        Automatically assign the logged-in admin to the intervention.
        """
        # Save the instance first
        instance = serializer.save(admin=self.request.user.admin)
        # Then call the handler with the required arguments
        handle_intervention_status_and_equipement_state(
            sender=self.__class__, instance=instance, created=True)


class InterventionPreventiveUpdateView(generics.UpdateAPIView):
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAdmin | IsTechnician, IsAuthenticated]
    lookup_field = 'id_intervention'

    def perform_update(self, serializer):
        instance = serializer.save()
        handle_intervention_status_and_equipement_state(
            sender=self.__class__, instance=instance, created=False)


class InterventionCurrativeUpdateView(generics.UpdateAPIView):
    queryset = InterventionCurrative.objects.all()
    permission_classes = [IsAdmin | IsPersonnel |
                          IsTechnician, IsAuthenticated]
    lookup_field = 'id_intervention'

    def get_serializer_class(self):
        if IsAdmin().has_permission(self.request, self):
            return AdminInterventionCurrativeSerializer
        return UserInterventionCurrativeSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        handle_intervention_status_and_equipement_state(
            sender=self.__class__, instance=instance, created=False)
