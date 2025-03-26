from rest_framework import viewsets
from rest_framework.generics import ListAPIView , CreateAPIView , UpdateAPIView , DestroyAPIView
from rest_framework.response import Response   
from rest_framework import status 
from rest_framework import permissions  , filters 
from rest_framework.permissions import IsAuthenticated as IsAuth
from .models import Intervention, Status 
from .serializers import InterventionSerializer 
from accounts_management.permissions import IsAdminUser , IsTechnician , IsPersonnel



class InterventionCreateAPIView(CreateAPIView):
    """Handle creating interventions with auto-assigned status"""
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer
    permission_class = [IsAuth, IsAdminUser]
    
    def perform_create(self, serializer):
        # Get or create the 'Affecter' status
        statut, created = Status.objects.get_or_create(name="Affecter")
        
        # Save the intervention with default status
        intervention = serializer.save(statut=statut)
        
        # Update the equipment status to "En maintenance"
        equipement = intervention.id_equipement
        from equipements_management.models import EtatEquipement
        maintenance_state, _ = EtatEquipement.objects.get_or_create(nom="En maintenance")
        equipement.etat = maintenance_state
        equipement.save()
        
        return intervention

class InterventionListAPIView (ListAPIView) : 
    serializer_class  = InterventionSerializer 
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
    serializer_class = InterventionSerializer
    permission_classes = [IsAuth, IsTechnician]
    def get_queryset(self):
        return Intervention.objects.filter(id_technicien=self.request.user.technicien)
    

class InterventionUpdateAPIView(UpdateAPIView):
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer
    
    def update(self, request, *args, **kwargs):
        # Handle PATCH requests as partial updates
        if request.method == 'PATCH':
            kwargs['partial'] = True
        
        # Get the intervention to be updated
        intervention = self.get_object()
        
        # Check if status is being updated
        if 'statut' in request.data or 'statut_name' in request.data:
            user = request.user
            
            # For testing without authentication:
            # if request.query_params.get('role') != 'technicien':
            #     return Response(
            #         {"detail": "Only technicians can update intervention status"}, 
            #         status=status.HTTP_403_FORBIDDEN
            #     )
            
            # When authentication is active, uncomment this block:
            """
            if not hasattr(user, 'technicien'):
                return Response(
                    {"detail": "Only technicians can update intervention status"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            """
        
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
    serializer_class = InterventionSerializer
    permission_classes = [IsAuth, IsAdminUser]



class TechnicianInterventionUpdateAPIView(UpdateAPIView):
    serializer_class = InterventionSerializer
    permission_classes = [IsAuth, IsTechnician]
    
    def get_queryset(self):
        """Only allow technicians to update interventions assigned to them"""
        return Intervention.objects.filter(id_technicien=self.request.user.technicien)
    
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

        return intervention


class EquipementLogs (ListAPIView) : 
    queryset = Intervention.objects.all () 
    serializer_class = InterventionSerializer
    def get_queryset(self):
        equipement_id = self.request.query_params.get ("equipement_id") 
        if not equipement_id : 
            return Intervention.objects.none () 
        return Intervention.objects.filter (id_equipement = equipement_id , statut = 1)
    
    def list (self , request , *args  , **kwargs) : 
        queryset = self.get_queryset ()

        serializer  = self.get_serializer (queryset , many = True) 
        return Response (serializer.data) 
    


    