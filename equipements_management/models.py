from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField
# Removing this import to fix circular dependency
# from intervention_management.models import Intervention

# Create your models here.


class Equipement(models.Model):
    
    ETAT_CHOICES = [
        ('En service', 'En service'),
        ('En maintenance', 'En maintenance'),
        ('En panne', 'En panne'),
    ]

    id_equipement = models.IntegerField(primary_key=True, verbose_name='ID Equipement', default=0)
    nom = models.CharField(max_length=100)
    categorie = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    localisation = models.CharField(max_length=100)
    date_ajout = models.DateTimeField(auto_now_add=True)
    etat = models.CharField(max_length=20, choices=ETAT_CHOICES, default='En service')
    manuel = models.BinaryField(null=True, blank=True)
    
    def get_maintenance_history(self):
        """Return complete maintenance history for this equipment"""
        from intervention_management.models import InterventionRecord, Intervention
        
        # Get all interventions for this equipment
        interventions = Intervention.objects.filter(id_equipement=self)
        
        # Get all records for these interventions
        intervention_ids = interventions.values_list('id', flat=True)
        return InterventionRecord.objects.filter(intervention__id__in=intervention_ids).order_by('-date_action')
    
    def __str__(self):
        return f"{self.nom}: {self.id_equipement}"
