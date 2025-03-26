import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField
# Removing this import to fix circular dependency
# from intervention_management.models import Intervention

# Create your models here.

# Add this before your Equipement model
class EtatEquipement(models.Model): 
    """Model to store possible equipment states"""
    nom = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.nom
    
    class Meta:
        verbose_name = "État d'équipement"
        verbose_name_plural = "États d'équipements"

class Equipement(models.Model):
    # remove the hard coded ETAT_CHOICE list  ; 
    # ETAT_CHOICES = [
    #     ('En service', 'En service'),
    #     ('En maintenance', 'En maintenance'),
    #     ('En panne', 'En panne'),
    # ]

    CATEGORIE_CHOICES  = [
    ("IT", "Équipement Informatique"),
    ("ELEC", "Équipement Électrique"),
    ("MECA", "Équipement Mécanique"),
    ("MED", "Équipement Médical"),
    ("LABO", "Équipement de Laboratoire"),
    ("INDUS", "Équipement Industriel"),
    ("SECUR", "Équipement de Sécurité"),
    ("COMM", "Équipement de Communication"),
    ("OUTILS", "Outils & Instruments"),
    ("AUTRE", "Autre"),
    ]

    TYPE_CHOICES  = [
    ("ORDI_PORT", "Ordinateur Portable"),
    ("ORDI_BUR", "Ordinateur de Bureau"),
    ("IMPRIMANTE", "Imprimante"),
    ("SERVEUR", "Serveur"),
    ("SWITCH", "Commutateur Réseau"),
    ("ROUTEUR", "Routeur"),
    ("ONDULEUR", "Onduleur (UPS)"),

    # Équipement Électrique
    ("GENERATEUR", "Générateur"),
    ("TRANSFO", "Transformateur"),
    ("DISJONCTEUR", "Disjoncteur"),
    ("BATTERIE", "Batterie"),

    # Équipement Mécanique
    ("POMPE", "Pompe"),
    ("COMPRESSEUR", "Compresseur"),
    ("MOTEUR", "Moteur Électrique"),
    ("VANNE", "Vanne"),

    # Équipement Médical
    ("RADIOLOGIE", "Machine de Radiologie"),
    ("IRM", "Scanner IRM"),
    ("DEFIBRILLATEUR", "Défibrillateur"),

    # Équipement de Laboratoire
    ("MICROSCOPE", "Microscope"),
    ("SPECTROMETRE", "Spectromètre"),
    ("CNC", "Machine CNC"),

    # Équipement Industriel
    ("CHARIOT", "Chariot Élévateur"),
    ("CONVOYEUR", "Bande Transporteuse"),
    ("SOUDURE", "Poste à Souder"),

    # Équipement de Sécurité
    ("EXTINCTEUR", "Extincteur"),
    ("ALARME", "Système d'Alarme"),
    ("EPI", "Équipement de Protection Individuelle"),

    # Équipement de Communication
    ("RADIO", "Émetteur Radio"),
    ("INTERPHONE", "Système Interphone"),
    ("CAMERA", "Caméra de Surveillance (CCTV)"),

    # Outils & Instruments
    ("MULTIMETRE", "Multimètre"),
    ("OSCILLO", "Oscilloscope"),
    ("PERCEUSE", "Perceuse Électrique"),

    # Autres
    ("AUTRE", "Autre"),
    ]





    LOCALISATION_CHOICES = [
    ('A1', 'A1'), ('AP1', 'AP1'), ('ME', 'ME'), ('M4', 'M4'), ('CP2', 'CP2'), ('CP6', 'CP6'), ('S4b', 'S4b'),
    ('S7', 'S7'), ('S11', 'S11'), ('S15', 'S15'), ('S19', 'S19'), ('DPGR1', 'DPGR1'),

    ('A2', 'A2'), ('AP2', 'AP2'), ('M1', 'M1'), ('M5', 'M5'), ('CP3', 'CP3'), ('CP7', 'CP7'), ('S4', 'S4'),
    ('S8', 'S8'), ('S12', 'S12'), ('S16', 'S16'), ('S20', 'S20'), ('DPGR2', 'DPGR2'),

    ('A3', 'A3'), ('CYB', 'CYB'), ('M2', 'M2'), ('MH', 'MH'), ('CP4', 'CP4'), ('CP8', 'CP8'), ('S5', 'S5'),
    ('S9', 'S9'), ('S13', 'S13'), ('S17', 'S17'), ('S21', 'S21'), ('MC1', 'MC1'),

    ('A4', 'A4'), ('SCBP', 'SCBP'), ('M3', 'M3'), ('CP1', 'CP1'), ('CP5', 'CP5'), ('CP9', 'CP9'), ('S6', 'S6'),
    ('S10', 'S10'), ('S14', 'S14'), ('S18', 'S18'), ('Visio', 'Visio'), ('MC2', 'MC2'),
    ('OTHER', 'Other'),  # Special case for custom input

]

    localisation  = models.CharField (
        max_length=255  , 
        choices=LOCALISATION_CHOICES , 
        blank = True ,  # allow empty value   
        null = True  
    )

    custom_localisation = models.CharField(
        max_length=255  , 
        blank =  True , 
        null = True , 
        help_text="utilser ce champ si other est selectionné"

    )

    def save (self , *args  , **kwargs) : 
        if self.localisation != 'OTHER' : 
            self.custom_localisation = ''  # just to clear the custom text if a predefined lcoalisation is selected
        super ().save(*args , **kwargs) 

    id_equipement = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    categorie = models.CharField(max_length=100 , null  = True  , blank = True , choices=CATEGORIE_CHOICES) 
    typee = models.CharField(max_length=100  , null = True , blank=True ,  choices=TYPE_CHOICES) 
    date_ajout = models.DateTimeField(auto_now_add=True)
    etat = models.ForeignKey(EtatEquipement, on_delete=models.PROTECT , blank=True , null=True) 
    manuel = models.BinaryField(null=True, blank=True)
    
    