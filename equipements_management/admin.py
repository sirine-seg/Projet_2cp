from django.contrib import admin
from .models import Equipement, EtatEquipement

# Enregistre les modèles pour qu'ils apparaissent dans Django Admin
admin.site.register(Equipement)
admin.site.register(EtatEquipement)

