from rest_framework import generics, mixins, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN
from django.shortcuts import get_object_or_404
from equipements_management.models import EtatEquipement, Equipement
from .models import InterventionPreventive, InterventionCurrative, Intervention, StatusIntervention
from notifications_management.models import Notification
from django.utils import timezone
from accounts_management.permissions import IsAdmin, IsTechnician, IsPersonnel
from .serializers import InterventionPreventiveSerializer, InterventionCurrativeSerializer, InterventionSerializer, StatusInterventionSerializer


class InterventionDetailView(APIView):
    """
    API view to retrieve details of an intervention regardless of its type.
    Attempts to find the intervention in different models and returns appropriate serialization.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        try:
            intervention = InterventionPreventive.objects.get(pk=pk)
            serializer = InterventionPreventiveSerializer(intervention)
        except InterventionPreventive.DoesNotExist:
            try:
                intervention = InterventionCurrative.objects.get(pk=pk)
                serializer = InterventionCurrativeSerializer(intervention)
            except InterventionCurrative.DoesNotExist:
                intervention = get_object_or_404(Intervention, pk=pk)
                serializer = InterventionSerializer(intervention)

        return Response(serializer.data)


class InterventionListView(generics.ListAPIView):
    """
    API view to list all interventions accessible to the current user.
    Filters interventions based on user role (admin, technician, or personnel).
    """
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


class InterventionPreventiveListView(generics.ListAPIView):
    """
    API view to list preventive interventions accessible to the current user.
    Only admins and technicians can access this view with appropriate filtering.
    """
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
    """
    API view to create preventive interventions.
    Only admins can create preventive interventions.
    Updates equipment status and creates notifications.
    """
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            statut = StatusIntervention.objects.get(name="affectée")
            serializer.save(statut=statut, admin=user.admin)
            equipement = serializer.validated_data.get('equipement')
            try:
                equipement.etat = EtatEquipement.objects.get(nom="En panne")
            except EtatEquipement.DoesNotExist:
                raise ValueError("L'état 'En panne' n'existe pas.")
            equipement.save()
            intervention = serializer.save(statut=statut, admin=user.admin, date_debut=timezone.now() +
                                           timezone.timedelta(hours=1))

            Notification.objects.create(
                user=user.admin.user,
                title="Nouvelle intervention préventive créée",
                related_intervention=intervention,
                notification_type="assignment",
                message=f"Une nouvelle intervention préventive a été créée sur l'équipement {intervention.equipement.nom}.",
                url=f"/interventions/preventive/{intervention.id}/details/"
            )
        else:
            raise PermissionDenied(
                "Seul un administrateur peut créer une intervention préventive."
            )


class InterventionPreventiveUpdateView(generics.UpdateAPIView):
    """
    API view to update preventive interventions.
    Admins can update all fields, technicians can only update status and notes.
    Updates equipment status based on intervention status changes.
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

    def perform_update(self, serializer):
        user = self.request.user
        intervention = serializer.save()

        if intervention.statut.name == "en cours":
            try:
                new_etat = EtatEquipement.objects.get(
                    nom="En maintenance")
                intervention.equipement.etat = new_etat
                intervention.equipement.save()
            except EtatEquipement.DoesNotExist:
                raise ValueError(
                    "L'état 'En maintenance' n'existe pas.")
        elif intervention.statut.name == "terminée":
            try:
                new_etat = EtatEquipement.objects.get(nom="En service")
                intervention.equipement.etat = new_etat
                intervention.equipement.save()
            except EtatEquipement.DoesNotExist:
                raise ValueError(
                    "L'état 'En service' n'existe pas.")

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
    API view to retrieve details of a preventive intervention.
    Only admins and assigned technicians can access this information.
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
    """
    API view to list curative interventions accessible to the current user.
    Filters based on user role (admin, technician, or personnel).
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


class InterventionCurrativeCreateView(generics.CreateAPIView):
    """
    API view to create curative interventions.
    Admins can create fully specified interventions, personnel can request interventions.
    Updates equipment status and creates notifications.
    """
    serializer_class = InterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsPersonnel]

    def perform_create(self, serializer):
        user = self.request.user

        serializer.validated_data['type_intervention'] = 'currative'

        if IsAdmin().has_permission(self.request, self):
            try:
                statut = StatusIntervention.objects.get(name="affectée")
            except StatusIntervention.DoesNotExist:
                raise ValueError("Le statut 'affectée' n'existe pas.")

            intervention = serializer.save(
                admin=user.admin, statut=statut, date_debut=timezone.now() +
                timezone.timedelta(hours=1)
            )

            if user.admin.user.active_notif:
                Notification.objects.create(
                    user=user.admin.user,
                    title="Nouvelle intervention curative créée",
                    related_intervention=intervention,
                    notification_type="assignment",
                    message=f"Une nouvelle intervention curative a été créée sur l'équipement {intervention.equipement.nom}.",
                )

            for technicien in intervention.technicien.all():
                if technicien.user.active_notif:
                    Notification.objects.create(
                        user=technicien.user,
                        title="Nouvelle intervention curative assignée",
                        related_intervention=intervention,
                        notification_type="assignment",
                        message=f"Vous avez été assigné une nouvelle intervention sur l'équipement {intervention.equipement.nom}.",
                    )
            equipement = serializer.validated_data.get('equipement')
            try:
                equipement_etat = EtatEquipement.objects.get(nom="En panne")
            except EtatEquipement.DoesNotExist:
                raise ValueError("L'état 'En panne' n'existe pas.")

            equipement.etat = equipement_etat
            equipement.save()

        elif IsPersonnel().has_permission(self.request, self):
            allowed_fields = ['id', 'user',
                              'equipement', 'description', 'statut', 'title', "type_intervention"]
            validated_data = {field: value for field, value in serializer.validated_data.items(
            ) if field in allowed_fields}

            for field in serializer.validated_data.keys():
                if field not in allowed_fields:
                    raise PermissionDenied(
                        f"Le personnel ne peut pas définir le champ '{field}'.")

            statut, _ = StatusIntervention.objects.get_or_create(
                name="en attente")
            intervention = serializer.save(user=user.personnel, statut=statut)

            equipement = serializer.validated_data.get('equipement')
            equipement_etat, _ = EtatEquipement.objects.get_or_create(
                nom="En panne")
            equipement.etat = equipement_etat
            equipement.save()

            if hasattr(user, 'personnel') and hasattr(user.personnel, 'admin'):
                Notification.objects.create(
                    user=user.personnel.admin.user,
                    title="Nouvelle demande d'intervention curative",
                    notification_type="assignment",
                    message=f"Une nouvelle demande d'intervention curative a été créée par {user.get_full_name()}.",
                    url="",
                )

        else:
            raise PermissionDenied(
                "Vous n'avez pas la permission de créer cette intervention.")


class InterventionCurrativeUpdateView(generics.UpdateAPIView):
    """
    API view to update curative interventions.
    Admins can update all fields, technicians can only update status and description.
    Updates equipment status based on intervention status changes.
    """
    serializer_class = InterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsTechnician]

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            return InterventionCurrative.objects.all()
        elif IsTechnician().has_permission(self.request, self):
            return InterventionCurrative.objects.filter(technicien=user.technicien)
        return InterventionCurrative.objects.none()

    def perform_update(self, serializer):
        user = self.request.user
        intervention = serializer.save()

        if intervention.statut.name == "en cours":
            try:
                new_etat = EtatEquipement.objects.get(
                    nom="En maintenance")
                intervention.equipement.etat = new_etat
                intervention.equipement.save()
            except EtatEquipement.DoesNotExist:
                raise ValueError(
                    "L'état 'En maintenance' n'existe pas.")
        elif intervention.statut.name == "terminée":
            try:
                new_etat = EtatEquipement.objects.get(nom="En service")
                intervention.equipement.etat = new_etat
                intervention.equipement.save()
            except EtatEquipement.DoesNotExist:
                raise ValueError(
                    "L'état 'En service' n'existe pas.")

        if IsTechnician().has_permission(self.request, self):
            allowed_fields = ['statut', 'description']
            data = serializer.validated_data

            for field in data.keys():
                if field not in allowed_fields:
                    raise PermissionDenied(
                        f"Le technicien ne peut pas modifier le champ '{field}'."
                    )


class InterventionCurrativeDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve details of a curative intervention.
    Admins, assigned technicians, and requesting personnel can access this information.
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
    """
    API view to cancel an intervention of any type.
    Only admins can cancel interventions by changing their status to 'annulée'.
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    lookup_field = 'id'

    def patch(self, request, type_intervention, id, *args, **kwargs):
        if type_intervention == 'preventive':
            intervention = get_object_or_404(InterventionPreventive, id=id)
        elif type_intervention == 'currative':
            intervention = get_object_or_404(InterventionCurrative, id=id)
        else:
            return Response({"detail": "Invalid intervention type."}, status=HTTP_403_FORBIDDEN)

        if IsAdmin().has_permission(request, self):
            status = StatusIntervention.objects.get(name="annulée")
            intervention.statut = status
            intervention.save()
            return Response({"detail": "Le statut de l'intervention a été mis à jour en annulé."}, status=HTTP_200_OK)
        else:
            return Response({"detail": "Seuls les administrateurs peuvent annuler des interventions."}, status=HTTP_403_FORBIDDEN)


class StatusInterventionListView(generics.ListAPIView):
    """
    API view to list all intervention status options.
    Only accessible by administrators.
    """
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAuthenticated]
    queryset = StatusIntervention.objects.all()


class StatusInterventionCreateView(generics.CreateAPIView):
    """
    API view to create new intervention status options.
    Only accessible by administrators.
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


class InterventionCurrativeAffecterView(generics.UpdateAPIView):
    """
    API view to assign a curative intervention to technicians.
    Only admins can assign interventions and update their status.
    Updates equipment state to 'En panne' when assigned.
    """
    serializer_class = InterventionCurrativeSerializer
    queryset = InterventionCurrative.objects.all()
    lookup_field = 'id'

    def perform_update(self, serializer):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):
            intervention = serializer.save()

            affecter_status = StatusIntervention.objects.get(name="affectée")
            intervention.statut = affecter_status
            intervention.admin = user.admin
            intervention.save(update_fields=['statut', 'admin'])

            en_maintenance_etat = EtatEquipement.objects.get(nom="En panne")
            equip = intervention.equipement
            equip.etat = en_maintenance_etat
            equip.save(update_fields=['etat'])


class InterventionListAllView(generics.ListAPIView):
    """
    API view to list all interventions without filtering.
    Requires authentication.
    """
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer
    permission_classes = [IsAuthenticated]


class InterventionPreventiveListAllView(generics.ListAPIView):
    """
    API view to list all preventive interventions without filtering.
    Requires authentication.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated]


class InterventionCurrativeListAllView(generics.ListAPIView):
    """
    API view to list all curative interventions without filtering.
    Requires authentication.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = InterventionCurrativeSerializer
    permission_classes = [IsAuthenticated]


class InterventionsByEquipementView(APIView):
    """
    API view to retrieve all interventions for a specific equipment.
    Returns equipment details and a list of related interventions.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, equipement_id, *args, **kwargs):
        equipement = get_object_or_404(Equipement, id_equipement=equipement_id)

        interventions = Intervention.objects.filter(
            equipement=equipement).order_by('-date_debut')

        serializer = InterventionSerializer(interventions, many=True)

        return Response({
            "equipement": {
                "id": equipement.id_equipement,
                "nom": equipement.nom,
                "etat": equipement.etat.nom,
            },
            "interventions": serializer.data
        })
