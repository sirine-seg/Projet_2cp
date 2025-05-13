from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from .models import StatusIntervention, InterventionPreventive, InterventionCurrative
from equipements_management.models import Equipement, EtatEquipement
from accounts_management.models import User
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


def create_default_statuses():
    """
    Create default statuses for interventions if they don't already exist.
    """
    default_statuses = [
        "en attente",
        "affectée",
        "en cours",
        "terminée",
        "annulée"
    ]
    for status_name in default_statuses:
        StatusIntervention.objects.get_or_create(name=status_name)


def create_default_equipement_states():
    """
    Create default equipment states if they don't already exist.
    """
    default_states = [
        "En service",
        "En panne",
        "En maintenance",
    ]
    for state_name in default_states:
        EtatEquipement.objects.get_or_create(nom=state_name)


@receiver(post_migrate)
def initialize_defaults(sender, **kwargs):
    """
    Signal to create default statuses and equipment states after migrations.
    """
    create_default_statuses()
    create_default_equipement_states()


#@receiver(post_save  , sender=InterventionCurrative)
#@receiver(post_save  , sender=InterventionPreventive)
#def set_status_affecetee (sender , instance , created  , **kwargs) :
#    logger.info(f"post_save signal received for {sender} instance {instance.pk}")
#    print(f"post_save signal received for {sender} instance {instance.pk}")
#    affectee_status  = StatusIntervention.objects.get(name="affectée")
#    if affectee_status is None  :
#        print ("status not found")
#        return # Status not found  , do nothing
#    # check if techniciens are assigned
#    if instance.technicien.exists () :
#        print ("techniciens assigned")
#        # update status if not already 'affectée'
#        if instance.statut != affectee_status :
#            instance.statut = affectee_status
#            instance.save(update_fields=["statut"])