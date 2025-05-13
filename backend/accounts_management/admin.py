from django.contrib import admin


# Register your models here.

from .models import User, Admin, Technicien, Personnel, Poste

# Enregistre les modèles dans l'interface d'administration
admin.site.register(User)
admin.site.register(Admin)
admin.site.register(Technicien)
admin.site.register(Personnel)
admin.site.register(Poste)
