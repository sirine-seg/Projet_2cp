from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField


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
            raise ValueError(
                "Le superutilisateur doit avoir is_superuser=True")

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

    role = models.CharField(
        max_length=15, choices=ROLE_CHOICES, verbose_name='Rôle', default='Personnel')
    numero_tel = PhoneNumberField(verbose_name='Numéro de téléphone', unique=True, null=True,
                                  help_text='Entrez le numéro au format international (ex: +213XXXXXXXXX)')
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, verbose_name='Prénom')
    last_name = models.CharField(max_length=50, verbose_name='Nom')
    password = models.CharField(
        max_length=100, verbose_name='Mot de passe', null=True, blank=True)
    photo = models.ImageField(
        upload_to='profile_pics/', verbose_name='Photo de profil', null=True, blank=True)

    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"


class Admin(models.Model):

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Admin: {self.user.email}"


class Poste(models.Model):

    nom = models.CharField(max_length=100, unique=True,
                           verbose_name="Nom du poste")

    def __str__(self):
        return self.nom


class Technicien(models.Model):

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)
    disponibilite = models.BooleanField(default=True)
    poste = models.ForeignKey(
        Poste, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Poste")

    def __str__(self):
        return f"Technicien: {self.user.email}"


class Personnel(models.Model):

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Personnel: {self.user.email}"
