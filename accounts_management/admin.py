from django.contrib import admin
from .models import User, Admin, Technicien, Personnel

# Enregistre les modèles dans l'interface d'administration
admin.site.register(User)
admin.site.register(Admin)
admin.site.register(Technicien)
admin.site.register(Personnel)