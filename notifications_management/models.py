from django.conf import settings  # Import settings to use AUTH_USER_MODEL
from django.db import models
from django.utils.timezone import now


class Notification(models.Model):
    """
    Model to represent pop-up notifications.
    """

    NOTIFICATION_TYPES = (
        ('assignment', 'Nouvelle Intervention Assignée'),
        ('reminder', "Rappel d'Intervention"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Use the custom user model
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    title = models.CharField(max_length=255)
    notification_type = models.CharField(
        max_length=10, choices=NOTIFICATION_TYPES
    )
    message = models.TextField()
    created_at = models.DateTimeField(default=now)
    is_read = models.BooleanField(default=False)
    url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Notification for {self.user.email}: {self.title}"

    def mark_as_read(self):
        """
        Mark the notification as read.
        """
        self.is_read = True
        self.save()

    def toggle_active(self):
        """
        Toggle the active state of the notification.
        """
        self.is_active = not self.is_active
        self.save()