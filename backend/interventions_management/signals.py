from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Intervention, StatusIntervention
from equipements_management.models import Equipement, EtatEquipement
from accounts_management.models import User


@receiver(post_save, sender=Intervention)
def handle_intervention_status_and_equipement_state(sender, instance, created, **kwargs):
    """
    Handle changes to intervention status and equipment state based on the conditions.
    """
    if created:
        # When an intervention is created by Admin
        if instance.admin:
            affecte_status, _ = StatusIntervention.objects.get_or_create(
                name="affectée")
            panne_state, _ = EtatEquipement.objects.get_or_create(
                nom="En panne")
            instance.statut = affecte_status
            instance.equipement.etat = panne_state
            instance.save(update_fields=['statut'])
            instance.equipement.save()

        # When an intervention is created by Personnel or Technicien
        elif instance.user:
            attente_status, _ = StatusIntervention.objects.get_or_create(
                name="en attente")
            panne_state, _ = EtatEquipement.objects.get_or_create(
                nom="En panne")
            instance.statut = attente_status
            instance.equipement.etat = panne_state
            instance.save(update_fields=['statut'])
            instance.equipement.save()

    # When Admin assigns a technician to the intervention
    if instance.technicien.exists() and instance.statut.name == "en attente":
        affecte_status, _ = StatusIntervention.objects.get_or_create(
            name="affectée")
        instance.statut = affecte_status
        instance.save(update_fields=['statut'])

    # When a technician accepts the intervention
    if instance.statut.name == "affectée" and instance.technicien.exists():
        en_cours_status, _ = StatusIntervention.objects.get_or_create(
            name="en cours")
        maintenance_state, _ = EtatEquipement.objects.get_or_create(
            nom="En maintenance")
        instance.statut = en_cours_status
        instance.equipement.etat = maintenance_state
        instance.save(update_fields=['statut'])
        instance.equipement.save()

    # When a technician completes the intervention
    if instance.statut.name == "en cours" and instance.equipement:
        termine_status, _ = StatusIntervention.objects.get_or_create(
            name="terminée")
        en_service_state, _ = EtatEquipement.objects.get_or_create(
            nom="En service")
        instance.statut = termine_status
        instance.equipement.etat = en_service_state
        instance.save(update_fields=['statut'])
        instance.equipement.save()

    # When a technician cancels the intervention
    if instance.statut.name == "annulée":
        attente_status, _ = StatusIntervention.objects.get_or_create(
            name="en attente")
        panne_state, _ = EtatEquipement.objects.get_or_create(nom="En panne")
        instance.statut = attente_status
        instance.equipement.etat = panne_state
        instance.save(update_fields=['statut'])
        instance.equipement.save()
