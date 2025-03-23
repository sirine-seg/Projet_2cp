from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from accounts_management.models import Technicien, Personnel, Admin
from equipements_management.models import Equipement


## in all the code status is the name of the model , serializer   , statut is  the name of an attribute  ; 

# New Status model for dynamic status choices
class Status(models.Model):
    name = models.CharField(max_length=50, unique=True)
#   description = models.TextField(blank=True, null=True) the most not needed thing in the project  ; 
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Statuses"



class Intervention(models.Model):
     
    #the MAINTENANCE_TYPE_CHOICES used for calculations and automatic planning


    URGENCE_CHOICES = [
        (0, 'Urgence vitale'),
        (1, 'Urgence élevée'),
        (2, 'Urgence modérée'),
        (3, 'Faible urgence'),
    ]

    # Remove the STATUT_CHOICES list
    
    id_equipement = models.ForeignKey('equipements_management.Equipement', on_delete=models.CASCADE)
    id_personnel = models.ForeignKey('accounts_management.Personnel', on_delete=models.CASCADE  ,   blank = True , null=True )
    id_technicien = models.ForeignKey('accounts_management.Technicien', on_delete=models.CASCADE)
    id_admin = models.ForeignKey('accounts_management.Admin', on_delete=models.CASCADE)

    urgence = models.IntegerField(choices=URGENCE_CHOICES, default=3)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    # Replace CharField with ForeignKey to Status model 
    statut = models.ForeignKey(Status, on_delete=models.PROTECT)
    description = models.TextField(blank = True , null = True) 
    notes  = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Intervention sur {self.id_equipement.nom} par {self.id_technicien.user.email}"


