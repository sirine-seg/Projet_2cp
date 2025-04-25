from django.db import models
from accounts_management.models import Technicien, Personnel, Admin
from django.utils import timezone
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
    """Base model to store core intervention details."""

    # Intervention types
    TYPE_PREVENTIVE = 'preventive'
    TYPE_CURRATIVE = 'currative'
    TYPE_CHOICES = [
        (TYPE_PREVENTIVE, 'Intervention préventive'),
        (TYPE_CURRATIVE, 'Intervention currative'),
    ]

    # Urgency levels for interventions
    URGENCE_CHOICES = [
        (0, 'Urgence vitale'),
        (1, 'Urgence élevée'),
        (2, 'Urgence modérée'),
        (3, 'Faible urgence'),
    ]

    type_intervention = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        verbose_name="Type d'intervention"
    )
    title = models.CharField(max_length=255, verbose_name="Titre")
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
        return f"Intervention {self.get_type_intervention_display()} sur {self.equipement.nom}"

    class Meta:
        verbose_name = "Intervention"
        verbose_name_plural = "Interventions"

    def check_date(self):
        """
        Ensure that the date_debut is always greater than the current time.
        """
        if self.date_debut and self.date_debut <= timezone.now():
            raise ValueError(
                "La date de début doit être supérieure à l'heure actuelle.")


class InterventionPreventive(Intervention):
    """Extension model for preventive intervention specific fields."""
    period = models.DurationField(
        blank=True, verbose_name="Période d'intervention préventive"
    )

    def __str__(self):
        return f"Détails préventifs pour {self.title}"

    class Meta:
        verbose_name = "Intervention préventive"
        verbose_name_plural = "Interventions préventives"

    def check_and_recreate(self):
        """
        Check if the intervention needs to be recreated and create a new one if necessary.
        """
        if self.date_debut and self.period:
            next_date = self.date_debut + self.period
            if next_date <= timezone.now():
                new_intervention = InterventionPreventive.objects.create(
                    type_intervention=self.type_intervention,
                    title=self.title,
                    equipement=self.equipement,
                    technicien=self.technicien.all(),
                    admin=self.admin,
                    urgence=self.urgence,
                    date_debut=next_date,
                    statut=self.statut,
                    blocked=self.blocked,
                    description=self.description,
                    notes=self.notes,
                    period=self.period
                )
                return new_intervention
        return None


class InterventionCurrative(Intervention):
    """Extension model for currative intervention specific fields."""
    user = models.ForeignKey(
        Personnel, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Utilisateur"
    )
    date_fin = models.DateTimeField(
        null=True, blank=True, verbose_name="Date de fin"
    )

    def __str__(self):
        return f"Détails curatifs pour {self.title}"

    class Meta:
        verbose_name = "Intervention currative"
        verbose_name_plural = "Interventions curratives"

    def check_date(self):
        """
        Ensure that the date_fin is always greater than the date_debut.
        """
        if self.date_fin and self.date_fin <= self.date_debut:
            raise ValueError(
                "La date de fin doit être supérieure à la date de début.")
