from django.db.models.signals import post_save 
from django.dispatch import receiver  
from .models import Intervention, Equipement 
from equipements_management.models import EtatEquipement

@receiver(post_save, sender=Intervention) 
def set_equipement_maintenace(sender, instance, created, **kwargs): 
    '''set the equipement status to maintenance when an intervention is created'''
    if created: 
        equipement = instance.id_equipement 
        maintenance_state, _ = EtatEquipement.objects.get_or_create(nom='En maintenance')
        equipement.etat = maintenance_state
        equipement.save()

@receiver(post_save, sender=Intervention)
def update_equipement_status(sender, instance, created, **kwargs):
    """Update equipment status when intervention status changes."""
    if created:
        return
        
    if instance.statut.name == "Terminé":
        try:
            etat_service, _ = EtatEquipement.objects.get_or_create(nom="En service")
            instance.id_equipement.etat = etat_service
            instance.id_equipement.save()
        except EtatEquipement.DoesNotExist:
            pass
            
    elif instance.statut.name == "En cours":
        try:
            etat_maintenance, _ = EtatEquipement.objects.get_or_create(nom='En maintenance')
            instance.id_equipement.etat = etat_maintenance
            instance.id_equipement.save()
        except EtatEquipement.DoesNotExist:
            pass
            
    elif instance.statut.name == "Affecter":
        try:
            etat_maintenance, _ = EtatEquipement.objects.get_or_create(nom='En maintenance')  
            instance.id_equipement.etat = etat_maintenance
            instance.id_equipement.save()
        except EtatEquipement.DoesNotExist:
            pass