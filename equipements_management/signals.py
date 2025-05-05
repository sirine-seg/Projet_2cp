from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import LocalisationEquipement


def create_default_localizations():
    """
    Create default localizations if they don't already exist.
    """
    default_localizations = [
        "AP1", "AP2", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "CP1", "CP2",
        "CP3", "CP4", "CP5", "CP6", "CP7", "S4", "S5", "S6", "S7", "S8", "S9",
        "S10", "S11", "S12", "S13", "S14", "S15", "S16", "S17", "S18",
        "S19", "S20", "S21", "S22", "S23", "S24", "S25", "S26", "S27", "S28",
        "S29", "S30", "S31", "S32", "S33", "Bibliotheque", "Auditorium",
        "M1", "M2", "M3", "M4"
    ]
    for loc_name in default_localizations:
        LocalisationEquipement.objects.get_or_create(nom=loc_name)


@receiver(post_migrate)
def initialize_localizations(sender, **kwargs):
    """
    Signal to create default localizations after migrations.
    """
    if sender.name == 'equipements_management':  # Ensure this runs only for the current app
        create_default_localizations()