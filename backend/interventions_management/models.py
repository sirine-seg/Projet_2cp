from django.db import models
from accounts_management.models import Technicien, Personnel, Admin
from equipements_management.models import Equipement


class StatusIntervention(models.Model):
    """Model to store possible statuses for interventions."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Statut d'intervention"
        verbose_name_plural = "Statuts d'intervention"


class Intervention(models.Model):
    """Model to store intervention details."""

    # Urgency levels for interventions
    URGENCE_CHOICES = [
        (0, 'Urgence vitale'),
        (1, 'Urgence élevée'),
        (2, 'Urgence modérée'),
        (3, 'Faible urgence'),
    ]

    title = models.CharField(max_length=255, verbose_name="Titre")
    id_intervention = models.AutoField(
        primary_key=True, verbose_name="ID d'intervention")
    equipement = models.ForeignKey(
        Equipement, on_delete=models.CASCADE, verbose_name="Équipement"
    )
    technicien = models.ManyToManyField(
        Technicien, blank=True, verbose_name="Technicien"
    )
    admin = models.ForeignKey(
        Admin, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Administrateur"
    )
    urgence = models.IntegerField(
        choices=URGENCE_CHOICES, default=3, null=True, blank=True, verbose_name="Niveau d'urgence"
    )
    date_debut = models.DateTimeField(
        null=True, blank=True, verbose_name="Date de début")

    statut = models.ForeignKey(
        StatusIntervention, on_delete=models.PROTECT, blank=True, null=True, verbose_name="Statut"
    )
    blocked = models.BooleanField(default=False, verbose_name="Bloqué")
    description = models.TextField(
        blank=True, null=True, verbose_name="Description")
    notes = models.TextField(blank=True, null=True, verbose_name="Notes")

    def __str__(self):
        return f"Intervention sur {self.equipement.nom} par {self.technicien.user.email if self.technicien else 'N/A'}"

    class Meta:
        abstract = True
        verbose_name = "Intervention"
        verbose_name_plural = "Interventions"


class InterventionPreventive(Intervention):
    """Model to store preventive interventions."""
    period = models.DurationField(
        null=True, blank=True, verbose_name="Date d'intervention préventive"
    )

    def __str__(self):
        return f"Intervention préventive sur {self.equipement.nom}"


class InterventionCurrative(Intervention):
    """Model to store currative interventions."""
    user = models.ForeignKey(
        Personnel, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Utilisateur"
    )
    date_fin = models.DateTimeField(
        null=True, blank=True, verbose_name="Date de fin")

    def __str__(self):
        return f"Intervention currative sur {self.equipement.nom}"
