import uuid
from django.db import models


class EtatEquipement(models.Model):
    """Model to store possible equipment states"""
    nom = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nom

    class Meta:
        verbose_name = "État d'équipement"
        verbose_name_plural = "États d'équipements"


class CategorieEquipement(models.Model):
    """Model to store equipment categories"""
    nom = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nom

    class Meta:
        verbose_name = "Catégorie d'équipement"
        verbose_name_plural = "Catégories d'équipements"


class TypeEquipement(models.Model):
    """Model to store equipment types"""
    nom = models.CharField(max_length=100, unique=True)
    categorie = models.ForeignKey(
        CategorieEquipement, on_delete=models.CASCADE, related_name="types"
    )

    def __str__(self):
        return f"{self.nom} ({self.categorie.nom})"

    class Meta:
        verbose_name = "Type d'équipement"
        verbose_name_plural = "Types d'équipements"


class LocalisationEquipement(models.Model):
    """Model to store equipment locations"""
    nom = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nom

    class Meta:
        verbose_name = "Localisation d'équipement"
        verbose_name_plural = "Localisations d'équipements"


class Equipement(models.Model):
    """Model to store equipment details"""
    id_equipement = models.AutoField(primary_key=True)
    code = models.CharField(max_length=100, unique=True,
                            verbose_name="Code inventaire", null=True)
    nom = models.CharField(max_length=100)
    categorie = models.ForeignKey(
        CategorieEquipement, on_delete=models.CASCADE, null=True, blank=True
    )
    typee = models.ForeignKey(
        TypeEquipement, on_delete=models.CASCADE, null=True, blank=True
    )
    localisation = models.ForeignKey(
        LocalisationEquipement, on_delete=models.CASCADE, null=True, blank=True
    )
    date_ajout = models.DateTimeField(auto_now_add=True)
    etat = models.ForeignKey(
        EtatEquipement, on_delete=models.PROTECT, blank=True, null=True
    )
    manuel = models.FileField(upload_to="manuals/", null=True, blank=True)
    image = models.ImageField(
        upload_to="equipements_pics/", verbose_name="Photo équipement", null=True, blank=True
    )

    def __str__(self):
        return self.nom