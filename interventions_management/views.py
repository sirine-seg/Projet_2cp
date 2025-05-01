from rest_framework import generics, mixins, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN
from django.shortcuts import get_object_or_404
from equipements_management.models import EtatEquipement, Equipement
from .models import InterventionPreventive, InterventionCurrative, Intervention, StatusIntervention
from accounts_management.permissions import IsAdmin, IsTechnician, IsPersonnel
from .serializers import InterventionPreventiveSerializer, InterventionCurrativeSerializer, InterventionSerializer, StatusInterventionSerializer


class InterventionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        # Try to find the intervention with the given pk in all three models
        try:
            intervention = InterventionPreventive.objects.get(pk=pk)
            serializer = InterventionPreventiveSerializer(intervention)
        except InterventionPreventive.DoesNotExist:
            try:
                intervention = InterventionCurrative.objects.get(pk=pk)
                serializer = InterventionCurrativeSerializer(intervention)
            except InterventionCurrative.DoesNotExist:
                # Fallback to generic Intervention if needed
                intervention = get_object_or_404(Intervention, pk=pk)
                serializer = InterventionSerializer(intervention)

        return Response(serializer.data)


class InterventionListView(generics.ListAPIView):
    serializer_class = InterventionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return Intervention.objects.all()
        elif IsTechnician().has_permission(self.request, self):
            return Intervention.objects.filter(technicien=user.technicien)
        elif IsPersonnel().has_permission(self.request, self):
            return Intervention.objects.filter(user=user.personnel)
        return Intervention.objects.none()


# class InterventionDetailView(generics.RetrieveAPIView):
#    serializer_class = InterventionSerializer
#    permission_classes = [IsAuthenticated]
#
#    def get_queryset(self):
#        user = self.request.user
#        if IsAdmin().has_permission(self.request, self):
#            return Intervention.objects.all()
#        elif IsTechnician().has_permission(self.request, self):
#            return Intervention.objects.filter(technicien=user.technicien)
#        elif IsPersonnel().has_permission(self.request, self):
#            return InterventionCurrative.objects.filter(user=user.personnel)
#        return Intervention.objects.none()


class InterventionPreventiveListView(generics.ListAPIView):
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsTechnician]

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return InterventionPreventive.objects.all()
        elif IsTechnician().has_permission(self.request, self):
            return InterventionPreventive.objects.filter(technician=user.technicien)
        return InterventionPreventive.objects.none()


class InterventionPreventiveCreateView(generics.CreateAPIView):
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            statut = StatusIntervention.objects.get(name="affectée")
            serializer.save(statut=statut, admin=user.admin)
        else:
            raise PermissionDenied(
                "Seul un administrateur peut créer une intervention préventive.")


class InterventionPreventiveUpdateView(generics.UpdateAPIView):
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsTechnician]

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return InterventionPreventive.objects.all()
        elif IsTechnician().has_permission(self.request, self):
            return InterventionPreventive.objects.filter(technicien=user.technicien)
        return InterventionPreventive.objects.none()

    def perform_update(self, serializer):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            serializer.save()
        elif IsTechnician().has_permission(self.request, self):
            allowed_fields = ['statut', 'notes']
            data = serializer.validated_data

            for field in data.keys():
                if field not in allowed_fields:
                    raise PermissionDenied(
                        f"Le technicien ne peut pas modifier le champ '{field}'."
                    )
            serializer.save()
        else:
            raise PermissionDenied(
                "Vous n'avez pas la permission de modifier cette intervention.")


class InterventionPreventiveDetailView(generics.RetrieveAPIView):
    """
    Retrieve the details of a specific preventive intervention.
    """
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsTechnician]

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return InterventionPreventive.objects.all()
        elif IsTechnician().has_permission(self.request, self):
            return InterventionPreventive.objects.filter(technicien=user.technicien)
        return InterventionPreventive.objects.none()


class InterventionCurrativeListView(generics.ListAPIView):
    serializer_class = InterventionCurrativeSerializer
    permission_classes = [IsAuthenticated,
                          IsAdmin | IsTechnician | IsPersonnel]

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return InterventionCurrative.objects.all()
        elif IsTechnician().has_permission(self.request, self):
            return InterventionCurrative.objects.filter(technician=user.technicien)
        elif IsPersonnel().has_permission(self.request, self):
            return InterventionCurrative.objects.filter(user=user.personnel)
        return InterventionCurrative.objects.none()


class InterventionCurrativeCreateView(generics.CreateAPIView):
    serializer_class = InterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsPersonnel]

    def perform_create(self, serializer):
        user = self.request.user

        # Admin logic
        if IsAdmin().has_permission(self.request, self):
            try:
                statut = StatusIntervention.objects.get(name="affectée")
            except StatusIntervention.DoesNotExist:
                raise ValueError("Le statut 'affectée' n'existe pas.")

            serializer.save(admin=user.admin, statut=statut)

            equipement = serializer.validated_data.get('equipement')
            try:
                equipement_etat = EtatEquipement.objects.get(nom="En panne")
            except EtatEquipement.DoesNotExist:
                raise ValueError("L'état 'En panne' n'existe pas.")

            equipement.etat = equipement_etat
            equipement.save()

        # Personnel logic
        elif IsPersonnel().has_permission(self.request, self):
            allowed_fields = ['id', 'user',
                              'equipement', 'description', 'statut']
            validated_data = {field: value for field, value in serializer.validated_data.items(
            ) if field in allowed_fields}

            for field in serializer.validated_data.keys():
                if field not in allowed_fields:
                    raise PermissionDenied(
                        f"Le personnel ne peut pas définir le champ '{field}'.")

            statut, _ = StatusIntervention.objects.get_or_create(
                name="en attente")
            serializer.save(user=user.personnel, statut=statut)

            equipement = serializer.validated_data.get('equipement')
            equipement_etat, _ = EtatEquipement.objects.get_or_create(
                nom="En panne")
            equipement.etat = equipement_etat
            equipement.save()

        # No permission
        else:
            raise PermissionDenied(
                "Vous n'avez pas la permission de créer cette intervention.")


class InterventionCurrativeUpdateView(generics.UpdateAPIView):
    serializer_class = InterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsTechnician]

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return InterventionCurrative.objects.all()
        elif IsTechnician().has_permission(self.request, self):
            return InterventionCurrative.objects.filter(technician=user.technicien)
        return InterventionCurrative.objects.none()

    def perform_update(self, serializer):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            serializer.save()  # Admin can update all fields
        elif IsTechnician().has_permission(self.request, self):
            allowed_fields = ['statut', 'description']
            data = serializer.validated_data

            for field in data.keys():
                if field not in allowed_fields:
                    raise PermissionDenied(
                        f"Le technicien ne peut pas modifier le champ '{field}'."
                    )
            serializer.save()
        else:
            raise PermissionDenied(
                "Vous n'avez pas la permission de modifier cette intervention.")


class InterventionCurrativeDetailView(generics.RetrieveAPIView):
    """
    Retrieve the details of a specific currative intervention.
    """
    serializer_class = InterventionCurrativeSerializer
    permission_classes = [IsAuthenticated,
                          IsAdmin | IsTechnician | IsPersonnel]

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return InterventionCurrative.objects.all()
        elif IsTechnician().has_permission(self.request, self):
            return InterventionCurrative.objects.filter(technician=user.technicien)
        elif IsPersonnel().has_permission(self.request, self):
            return InterventionCurrative.objects.filter(user=user.personnel)
        return InterventionCurrative.objects.none()


class InterventionCancelView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk, *args, **kwargs):
        """
        Cancel an intervention based on its type (preventive or currative).
        Only admins can cancel interventions.
        """
        intervention_type = self.kwargs.get('type', 'preventive')
        if intervention_type == 'preventive':
            intervention = get_object_or_404(InterventionPreventive, pk=pk)
        elif intervention_type == 'currative':
            intervention = get_object_or_404(InterventionCurrative, pk=pk)
        else:
            return Response({"detail": "Invalid intervention type."}, status=HTTP_403_FORBIDDEN)

        if IsAdmin().has_permission(request, self):
            intervention.statut = 'annulée'
            intervention.save()
            return Response({"detail": "Le statut de l'intervention a été mis à jour en annulé."}, status=HTTP_200_OK)
        else:
            return Response({"detail": "Seuls les administrateurs peuvent annuler des interventions."}, status=HTTP_403_FORBIDDEN)


class StatusInterventionListView(generics.ListAPIView):
    """
    List all statuses for interventions.
    Only accessible by authenticated users with admin permissions.
    """
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = StatusIntervention.objects.all()

    def get_queryset(self):
        if IsAdmin().has_permission(self.request, self):
            return StatusIntervention.objects.all()
        else:
            raise PermissionDenied(
                "Seul un administrateur peut accéder à la liste des statuts d'intervention.")


class StatusInterventionCreateView(generics.CreateAPIView):
    """
    Create a new status for an intervention.
    Only admins are allowed to create statuses.
    """
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = StatusIntervention.objects.all()

    def perform_create(self, serializer):
        if IsAdmin().has_permission(self.request, self):
            serializer.save()
        else:
            raise PermissionDenied(
                "Seul un administrateur peut créer un statut d'intervention.")