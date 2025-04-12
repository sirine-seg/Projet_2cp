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
    permission_classes = [IsAuth, IsAdminUser]  # Fixed typo: `permission_class` -> `permission_classes`
    
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
        notification = Notification.objects.create(
            recipient=intervention.technicien,  
            title="Nouvelle intervention assignée",
            message=f"Vous avez été assigné à une nouvelle intervention sur l'équipement {intervention.id_equipement.nom}. "
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
        return Intervention.objects.filter(id_technicien=self.request.user.technicien)
    

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
        old_status =  self.get_object().statut
        
        # Get original data before saving
        original_data = self.get_object().__dict__.copy()
        
        # Save the update
        intervention = serializer.save()
        new_status = intervention.statut

        # If the status changed to "Terminé"
        if old_status and new_status and old_status.id != new_status.id and new_status.name == "Terminé":
            # Update the equipment status to "En service"
            equipement = intervention.id_equipement
            from equipements_management.models import EtatEquipement
            active_state, _ = EtatEquipement.objects.get_or_create(nom="En service")
            equipement.etat = active_state
            equipement.save()

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
        return Intervention.objects.filter(technicien=self.request.user.technicien)
    
    def update(self, request, *args, **kwargs):
        if request.method == 'PATCH':
            kwargs['partial'] = True
            
        # No need to check if user is technician - permission class does that
        # No need to check if intervention belongs to technician - queryset does that

        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        # Your existing code for status updates
        old_status = self.get_object().statut
        intervention = serializer.save()
        new_status = intervention.statut

        if old_status and new_status and old_status.id != new_status.id and new_status.name == "Terminé":
            equipement = intervention.id_equipement
            from equipements_management.models import EtatEquipement
            active_state, _ = EtatEquipement.objects.get_or_create(nom="En service")
            equipement.etat = active_state
            equipement.save()
            
        # Notify admin of status change with email
            admins = intervention.id_admin
            if admins:
                notification = Notification.objects.create(
                    recipient=admins.user,
                    title="Intervention mise à jour par technicien",
                    message=f"Le technicien {intervention.id_technicien} a changé le statut de l'intervention sur "
                            f"{intervention.id_equipement.nom} de '{old_status}' à '{intervention.get_statut_display_custom()}'.",
                    notification_type="assignment",
                    url=f"/interventions/{intervention.id}/",
                )
                notification.send_email_notification()    
            
            # Notify personnel if intervention is complete
            if new_status in ['Termine', 'Resolu']:
                personnel = intervention.id_personnel
                if personnel:
                    notification = Notification.objects.create(
                        recipient=personnel.user,
                        title="Intervention terminée",
                        message=f"L'intervention sur {intervention.id_equipement.nom} a été marquée comme {intervention.get_statut_display_custom()} "
                                f"par le technicien {intervention.id_technicien}.",
                        notification_type="assignment",
                        url=f"/interventions/{intervention.id}/",
                    )
                    notification.send_email_notification()    

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
    


    