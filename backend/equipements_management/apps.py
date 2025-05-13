from django.apps import AppConfig


class EquipementsManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'equipements_management'

    def ready(self):
        # Import the signals module to ensure the signal handlers are registered
        import equipements_management.signals