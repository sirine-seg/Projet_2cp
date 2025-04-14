from django.contrib import admin
from .models import Intervention, Status

# Enregistre les modèles pour qu'ils apparaissent dans Django Admin
admin.site.register(Intervention)
admin.site.register(Status)
