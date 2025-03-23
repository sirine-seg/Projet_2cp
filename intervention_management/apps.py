from django.apps import AppConfig


class InterventionManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'intervention_management'

    def ready (self)  : 
        import intervention_management.signals


