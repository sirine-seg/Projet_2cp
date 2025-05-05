from django.apps import AppConfig
from django.db.models.signals import post_save


class InterventionsManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'interventions_management'

    def ready(self):
        # Import signal handlers here to register them when app is ready
        import interventions_management.signals