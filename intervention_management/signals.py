from django.db.models.signals import post_save 
from django.dispatch import receiver  
from .models import Intervention, Equipement  , Status 
from equipements_management.models import EtatEquipement 
from django.db.utils import IntegrityError
from accounts_management.models import User 

@receiver(post_save, sender=Intervention) 
def set_equipement_maintenace(sender, instance, created, **kwargs): 
    '''set the equipement status to maintenance when an intervention is created'''
    if created: 
        equipement = instance.equipement 
        maintenance_state, _ = EtatEquipement.objects.get_or_create(nom='En maintenance')
        equipement.etat = maintenance_state
        equipement.save()
@receiver (post_save   , sender = Intervention)  
def set_equipement_pending (sender  , instance  , created  ,  **kwargs)  : 
    '''set the equipement status to pending when an intervention is created by a     or (technician)'''
    if created and instance.user  : 
        try:
            pending_status  , _ = Status.objects.get_or_create (name = "pending") 
            # get or create returnes a tuple  . 
            instance.statut = pending_status
            instance.save (update_fields = ['statut'])
        except  IntegrityError:
            print ("Error : Duplicate 'pending' status creattion attempted .") 





@receiver(post_save, sender=Intervention)
def update_equipement_status(sender, instance, created, **kwargs):
    """Update equipment status when intervention status changes."""
    if created or instance.statut  is None:
        return
        
    if instance.statut.name == "Terminé":
        try:
            etat_service, _ = EtatEquipement.objects.get_or_create(nom="En service")
            instance.equipement.etat = etat_service
            instance.equipement.save()
        except EtatEquipement.DoesNotExist:
            pass
            
    elif instance.statut.name == "En cours":
        try:
            etat_maintenance, _ = EtatEquipement.objects.get_or_create(nom='En maintenance')
            instance.equipement.etat = etat_maintenance
            instance.equipement.save()
        except EtatEquipement.DoesNotExist:
            pass
            
    elif instance.statut.name == "Affecter":
        try:
            etat_maintenance, _ = EtatEquipement.objects.get_or_create(nom='En maintenance')  
            instance.equipement.etat = etat_maintenance
            instance.equipement.save()
        except EtatEquipement.DoesNotExist:
            pass


@receiver(post_save, sender=Intervention)
def assign_status_when_technicien_added (sender  , instance  , created  , **kwargs) : 
     """Update the status to 'Affecter' when an admin assigns a technician."""
     if created  : 
        return # this ensures that this signal only work on updates 
     
     request  = kwargs.get ('request')
     if not request or request.user.role != User.ADMIN : 
         return 
     
    # check if the technicien was just assigned (not already assigned)     
     if instance.technicien and instance.statut.name != "Affecter" : 
         # get or create the "Affecter" status 
         affecter_status , _  = Status.objects.get_or_create (name  = "Affecter") 


         # assign the new status  
         instance.statut = affecter_status 
         instance.save (update_fields = ['statut'])
         # save the instance