from django.db import models
from accounts_management.models import User
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import logging
import ssl

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
        """Enhanced version with special handling for institutional email domains"""
        if self.email_sent:
            return False
        
        if not self.recipient or not self.recipient.email:
            print("No email recipient")
            return False
        
        try:
            # Create context for email template
            context = {
                'notification': self,
                'frontend_url': settings.FRONTEND_URL,
            }
            
            # Render templates
            html_message = render_to_string('notifications/email_notification.html', context)
            plain_message = render_to_string('notifications/email_notification_plain.txt', context)
            
            # Get recipient domain for special handling
            recipient_email = self.recipient.email
            domain = recipient_email.split('@')[-1].lower()
            
            print(f"Sending to {recipient_email} (domain: {domain})")
            
            # Special handling for ESI.DZ domain
            if 'esi.dz' in domain:
                print("Using special handling for ESI.DZ domain")
                import smtplib
                from email.mime.text import MIMEText
                from email.mime.multipart import MIMEMultipart
                
                # Create message with additional headers for better deliverability
                msg = MIMEMultipart('alternative')
                msg['Subject'] = self.title
                msg['From'] = settings.DEFAULT_FROM_EMAIL
                msg['To'] = recipient_email
                
                # Add special headers to improve deliverability
                msg['Reply-To'] = settings.DEFAULT_FROM_EMAIL
                msg['X-Priority'] = '1'
                msg['X-MSMail-Priority'] = 'High'
                msg['Importance'] = 'High'
                msg['X-Mailer'] = 'Microsoft Outlook'  # Sometimes helps pass filters
                
                # Add plain text first (preferred by spam filters)
                msg.attach(MIMEText(plain_message, 'plain'))
                msg.attach(MIMEText(html_message, 'html'))
                
                # Create SSL context that accepts any certificate
                context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                
                # Connect with high debug level
                with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
                    server.set_debuglevel(2)  # Show all SMTP conversation
                    server.ehlo()
                    server.starttls(context=context)
                    server.ehlo()
                    server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                    
                    # Try sending with extra retry logic
                    max_retries = 3
                    for attempt in range(1, max_retries + 1):
                        try:
                            server.send_message(msg)
                            print(f"Message sent successfully on attempt {attempt}")
                            break
                        except Exception as e:
                            print(f"Attempt {attempt} failed: {str(e)}")
                            if attempt == max_retries:
                                raise
                
                # Successfully sent
                self.email_sent = True
                self.save(update_fields=['email_sent'])
                return True
                
            else:
                # For non-ESI domains, use standard method
                send_mail(
                    subject=self.title,
                    message=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recipient_email],
                    html_message=html_message,
                    fail_silently=True,
                )
                
                # Successfully sent
                self.email_sent = True
                self.save(update_fields=['email_sent'])
                return True
                
        except Exception as e:
            print(f"Email sending error: {str(e)}")
            return False
    
    def get_notification_type_display_custom(self):
        """Get display name for notification type with fallback"""
        if self.notification_type:
            for code, name in self.NOTIFICATION_TYPES:
                if code == self.notification_type:
                    return name
        return "Notification"
