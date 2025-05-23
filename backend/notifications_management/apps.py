from django.apps import AppConfig


class NotificationsManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications_management'

    def ready(self):
        import notifications_management.signals