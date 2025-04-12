from django.db import models
from accounts_management.models import User
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('reminder', "Rappel d'Intervention"),
        ('assignment', 'Nouvelle Intervention Assignée'),
    )
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='info')
    created_at = models.DateTimeField(default=timezone.now)
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    url = models.CharField(max_length=255, blank=True, null=True)  # Optional URL to redirect to when clicked
    email_sent = models.BooleanField(default=False)  # Track if email was sent
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} to {self.recipient.email}"
    
    def mark_as_read(self):
        """Mark the notification as read"""
        if not self.read:
            self.read = True
            self.read_at = timezone.now()
            self.save()
    
    def send_email_notification(self):
        """Send an email to notify the recipient about this notification"""
        # Skip if recipient has no email or email already sent
        if not self.recipient.email or self.email_sent:
            return False
            
        # Check if user has opted out of email notifications (if you implement this feature)
        email_pref = getattr(self.recipient, 'email_notifications_enabled', True)
        if not email_pref:
            logger.info(f"Email notification skipped: User {self.recipient.email} has disabled email notifications")
            return False
            
        # Create context for email templates
        context = {
            'notification': self,
            'frontend_url': settings.FRONTEND_URL,
            'user': self.recipient,
        }
        
        # Get notification type display name
        notification_type_display = dict(self.NOTIFICATION_TYPES).get(self.notification_type, "Notification")
        
        # Render email templates
        try:
            html_message = render_to_string('notifications/email_notification.html', context)
            plain_message = render_to_string('notifications/email_notification_plain.txt', context)
        except Exception as e:
            logger.error(f"Template rendering error: {str(e)}")
            return False
        
        # Send the email
        try:
            send_mail(
                subject=f"{notification_type_display}: {self.title}",
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.recipient.email],
                html_message=html_message,
                fail_silently=False,
            )
            # Mark as sent to prevent duplicate emails
            self.email_sent = True
            self.save(update_fields=['email_sent'])
            logger.info(f"Email notification sent to {self.recipient.email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}")
            return False
    
    def get_notification_type_display_custom(self):
        """Get display name for notification type with fallback"""
        if self.notification_type:
            for code, name in self.NOTIFICATION_TYPES:
                if code == self.notification_type:
                    return name
        return "Notification"
