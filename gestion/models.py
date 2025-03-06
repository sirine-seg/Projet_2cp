from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField

# Ceci doit etre instalé:
#python -m pip install Pillow
#pip install django-phonenumber-field
#pip install phonenumbers


""" Manager personnalisé pour le modèle User sans champ username """
class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Le superutilisateur doit avoir is_staff=True")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Le superutilisateur doit avoir is_superuser=True")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):

    ADMIN = 'Administrateur'
    TECHNICIEN = 'Technicien'
    PERSONNEL = 'Personnel'

    ROLE_CHOICES = [
        (ADMIN, 'Administrateur'),
        (TECHNICIEN, 'Technicien'),
        (PERSONNEL, 'Personnel'),
    ]

    # Champs supplémentaires
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, verbose_name='Rôle', default='Personnel')
    numero_tel = PhoneNumberField(verbose_name='Numéro de téléphone', unique=True, null=True)
    
    # Personnalisation des champs existants d'AbstractUser
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, verbose_name='Prénom') 
    last_name = models.CharField(max_length=50, verbose_name='Nom')
    password = models.CharField(max_length=100, verbose_name='Mot de passe')

    photo = models.ImageField(upload_to='profile_pics/', verbose_name='Photo de profil', null=True, blank=True)

    # email sera utilisé comme identifiant unique pour la connexion. ET on n'a pas besoin de username
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"


class Admin(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Admin: {self.user.email}"


class Technicien(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    disponibilite = models.BooleanField(default=True)
    poste = models.CharField(max_length=100)

    def __str__(self):
        return f"Technicien: {self.user.email}"


class Personnel(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Personnel: {self.user.email}"


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

    def __str__(self):
        return f"{self.nom}: {self.id_equipement}"


class Intervention(models.Model):

    URGENCE_CHOICES = [
        (0, 'Urgence vitale'),
        (1, 'Urgence élevée'),
        (2, 'Urgence modérée'),
        (3, 'Faible urgence'),
    ]

    STATUT_CHOICES = [
        ('En attente', 'En attente'),
        ('Affectee', 'Affectée'),
        ('En cours', 'En cours'),
        ('Terminee', 'Terminée'),
    ]

    id_equipement = models.ForeignKey('Equipement', on_delete=models.CASCADE)
    id_personnel = models.ForeignKey('Personnel', on_delete=models.CASCADE)
    id_technicien = models.ForeignKey('Technicien', on_delete=models.CASCADE)
    id_admin = models.ForeignKey('Admin', on_delete=models.CASCADE)

    urgence = models.IntegerField(choices=URGENCE_CHOICES, default=3)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES)
    description = models.TextField()

    def __str__(self):
        return f"Intervention sur {self.equipement.nom} par {self.technicien.user.email}"
