from rest_framework import viewsets
from rest_framework.generics import ListAPIView , CreateAPIView , UpdateAPIView , DestroyAPIView
from rest_framework.response import Response   
from rest_framework import status 
from rest_framework import permissions  , filters 
from rest_framework.permissions import IsAuthenticated as IsAuth
from .models import Intervention, Status 
from .serializers import AdminInterventionSerializer , UserInterventionSerializer , InterventionUpdateSerializer
from accounts_management.permissions import IsAdminUser , IsTechnician , IsPersonnel
from notifications_management.models import Notification
from rest_framework import serializers
from .permissions import CanDeclareIntervention

class AdminInterventionCreateAPIView(CreateAPIView):
    """Handle creating interventions with auto-assigned status"""
    queryset = Intervention.objects.all()
    serializer_class = AdminInterventionSerializer
    permission_classes = [IsAuth, IsAdminUser]
    
    def perform_create(self, serializer):
        # Save the intervention with the logged-in admin as the user
        intervention = serializer.save(admin=self.request.user.admin)

        # Retrieve the associated equipment
        equipement = intervention.equipement

        # Update the equipment's status to "En maintenance"
        from equipements_management.models import EtatEquipement
        maintenance_state, _ = EtatEquipement.objects.get_or_create(nom="En maintenance")
        equipement.etat = maintenance_state
        equipement.save()
        
        # Create notification with information about the intervention to the technician
        # FIX: Change id_equipement to equipement, id_technicien to technicien
        notification = Notification.objects.create(
            recipient=intervention.technicien.user,  # Make sure to get the user from technician
            title="Nouvelle intervention assignée",
            message=f"Vous avez été assigné à une nouvelle intervention sur l'équipement {intervention.equipement.nom}. "
                    f"Date de début: {intervention.date_debut.strftime('%d/%m/%Y %H:%M')}",
            notification_type="assignment",
            url=f"/interventions/{intervention.id}/",
        )
        
        # Send email notification
        notification.send_email_notification()
        
        return intervention
    
class UserInterventionCreateAPIView(CreateAPIView):
    queryset  = Intervention.objects.all () 
    serializer_class = UserInterventionSerializer
    permission_classes = [IsAuth]  # Use the custom permission class

    # def perform_create(self, serializer):
    #     try:
    #         personnel_instance = self.request.user.personnel  # ✅ Get Personnel instance
    #         serializer.save(personnel=personnel_instance , admin = None) 
    #     except AttributeError:
    #         raise serializers.ValidationError({"personnel": "No associated Personnel found for this user."})

class InterventionListAPIView (ListAPIView) : 
    serializer_class  = AdminInterventionSerializer 
    queryset = Intervention.objects.all ()
    permission_classes  = [permissions.IsAuthenticated , IsAdminUser]


    # def get_queryset (self) : 
    #     user  = self.request.user  

    #     if user.role  == IsAdminUser : 
    #         return Intervention.objects.all () 
    #     elif user.role == IsTechnician :  
    #         return Intervention.objects.filter (id_technicien = user) 
    #     elif user.role == IsPersonnel : 
    #         return Intervention.objects.filter (id_personnel = user)
        
    #     return Intervention.objects.none () 

class TechnicianInterventionsListAPIView(ListAPIView):

    """List only the interventions for the currently logged-in technician."""
    serializer_class = AdminInterventionSerializer
    permission_classes = [IsAuth, IsTechnician]
    def get_queryset(self):
        return Intervention.objects.filter(technicien=self.request.user.technicien)
    
class InterventionUpdateAPIView(UpdateAPIView):
    queryset = Intervention.objects.all()
    serializer_class = AdminInterventionSerializer
    
    def update(self, request, *args, **kwargs):
        # Handle PATCH requests as partial updates
        if request.method == 'PATCH':
            kwargs['partial'] = True
        
        # Get the intervention to be updated
        intervention = self.get_object()
        
        # Check if status is being updated
        if 'statut' in request.data or 'statut_name' in request.data:
            user = request.user
        
        # Continue with normal update process
        return super().update(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        old_status = self.get_object().statut

        # Get original data before saving
        original_intervention = self.get_object()
        original_admin = original_intervention.admin

        # Save the update while preserving the admin field if not explicitly set to null
        if 'admin' not in serializer.validated_data or serializer.validated_data.get('admin') is None:
            serializer.validated_data['admin'] = original_admin
             
        # Save the intervention with the updated data
        intervention = serializer.save()
        
        new_status = intervention.statut

        # If the status changed to "Terminé"
        if old_status and new_status and old_status.id != new_status.id and new_status.name == "Terminé":
            # Update the equipment status to "En service"
            equipement = intervention.equipement
            from equipements_management.models import EtatEquipement
            active_state, _ = EtatEquipement.objects.get_or_create(nom="En service")
            equipement.etat = active_state
            equipement.save()

        notification = Notification.objects.create(
            recipient=intervention.technicien.user,  # Make sure to get the user from technician
            title="Nouvelle intervention assignée",
            message=f"Vous avez été assigné à une nouvelle intervention sur l'équipement {intervention.equipement.nom}. "
                    f"Date de début: {intervention.date_debut.strftime('%d/%m/%Y %H:%M')}",
            notification_type="assignment",
            url=f"/interventions/{intervention.id}/",
        )
        
        # Send email notification
        notification.send_email_notification()
        
        # For debugging purposes, print info about the admin
        print(f"Intervention {intervention.id} updated with admin: {intervention.admin}")

        return intervention

class InterventionDeleteAPIView(DestroyAPIView):
    queryset = Intervention.objects.all()
    serializer_class = AdminInterventionSerializer
    permission_classes = [IsAuth, IsAdminUser]

class TechnicianInterventionUpdateAPIView(UpdateAPIView):
    serializer_class = InterventionUpdateSerializer
    permission_classes = [IsAuth, IsTechnician]

    def get_queryset(self):
        """Only allow technicians to update interventions assigned to them"""
        print("Fetching queryset for TechnicianInterventionUpdateAPIView...")  # Debugging
        queryset = Intervention.objects.filter(technicien=self.request.user.technicien)
        print(f"Queryset fetched: {queryset}")  # Debugging
        return queryset

    def update(self, request, *args, **kwargs):
        print("Update method called...")  # Debugging
        if request.method == 'PATCH':
            kwargs['partial'] = True
            print("Partial update enabled (PATCH request)...")  # Debugging

        response = super().update(request, *args, **kwargs)
        print("Update method completed.")  # Debugging
        return response

    def perform_update(self, serializer):
        print("perform_update method called...")  # Debugging

        old_status = self.get_object().statut
        print(f"Old status: {old_status}")  # Debugging

        intervention = serializer.save()
        print(f"Intervention saved: {intervention}")  # Debugging

        new_status = intervention.statut
        print(f"New status: {new_status}")  # Debugging

        if old_status and new_status and old_status.id != new_status.id :
            print("Status changed to 'Terminé'. Updating equipment status...")  # Debugging

            equipement = intervention.equipement
            from equipements_management.models import EtatEquipement
            active_state, _ = EtatEquipement.objects.get_or_create(nom="En service")
            equipement.etat = active_state
            equipement.save()
            print(f"Equipment status updated to 'En service' for equipment: {equipement}")  # Debugging

            admins = intervention.admin
            print(f"Admins: {admins}")  # Debugging

            if not admins:
                print(f"No admin found for intervention {intervention.id}")  # Debugging
            else:
                try:
                    print("Creating notification...")  # Debugging
                    notification = Notification.objects.create(
                        recipient=admins.user,
                        title="Intervention mise à jour par technicien",
                        message=f"Le technicien {intervention.technicien} a changé le statut de l'intervention sur "
                                f"{intervention.equipement.nom} de '{old_status}' à '{new_status}'.",
                        notification_type="assignment",
                        url=f"/interventions/{intervention.id}/",
                    )
                    notification.send_email_notification()
                    print(f"Notification sent to admin {admins.user.email} for intervention {intervention.id}")  # Debugging
                except Exception as e:
                    print(f"Failed to send notification: {e}")  # Debugging

        print("perform_update method completed.")  # Debugging
        return intervention

class EquipementLogs (ListAPIView) : 
    queryset = Intervention.objects.all () 
    serializer_class = AdminInterventionSerializer
    def get_queryset(self):
        equipement_id = self.request.query_params.get ("equipement_id") 
        if not equipement_id : 
            return Intervention.objects.none () 
        return Intervention.objects.filter (equipement = equipement_id , statut = 1)
    
    def list (self , request , *args  , **kwargs) : 
        queryset = self.get_queryset ()

        serializer  = self.get_serializer (queryset , many = True) 
        return Response (serializer.data)
