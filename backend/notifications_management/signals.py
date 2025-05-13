from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Notification
from django.conf import settings
from django.template.loader import render_to_string
import ssl


@receiver(post_save, sender=Notification)
def send_email_notification(sender, instance, created, **kwargs):
    """Enhanced version with special handling for institutional email domains"""
    if not created or instance.is_read:  # Avoid sending for already read notifications
        return False

    if not instance.user or not instance.user.email:
        print("No email recipient")
        return False

    if not instance.user.active_notif_email:
        print("User has disabled email notifications")
        return False

    try:
        # Fetch intervention details from the related field
        intervention = instance.related_intervention

        # Create context for email template
        context = {
            'notification': instance,
            'frontend_url': settings.FRONTEND_URL,
            'intervention': intervention,  # Pass intervention if it exists
        }

        # Render templates
        html_message = render_to_string(
            'notifications/email_notification.html', context)
        plain_message = render_to_string(
            'notifications/email_notification_plain.txt', context)

        # Get recipient domain for special handling
        recipient_email = instance.user.email
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
            msg['Subject'] = instance.title
            msg['From'] = settings.DEFAULT_FROM_EMAIL
            msg['To'] = recipient_email

            # Add special headers to improve deliverability
            msg['Reply-To'] = settings.DEFAULT_FROM_EMAIL
            msg['X-Priority'] = '1'
            msg['X-MSMail-Priority'] = 'High'
            msg['Importance'] = 'High'
            msg['X-Mailer'] = 'Microsoft Outlook'

            # Add plain text first (preferred by spam filters)
            msg.attach(MIMEText(plain_message, 'plain'))
            msg.attach(MIMEText(html_message, 'html'))

            # Create SSL context that accepts any certificate
            context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE

            # Connect with high debug level
            with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(settings.EMAIL_HOST_USER,
                             settings.EMAIL_HOST_PASSWORD)

                # Try sending with extra retry logic
                max_retries = 3
                for attempt in range(1, max_retries + 1):
                    try:
                        server.send_message(msg)
                        print(
                            f"Message sent successfully on attempt {attempt}")
                        break
                    except Exception as e:
                        print(f"Attempt {attempt} failed: {str(e)}")
                        if attempt == max_retries:
                            raise

            # Successfully sent
            instance.is_read = True  # Mark as read to avoid duplicate sends
            instance.save(update_fields=['is_read'])
            return True

        else:
            # For non-ESI domains, use standard method
            send_mail(
                subject=instance.title,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                html_message=html_message,
                fail_silently=True,
            )

            # Successfully sent
            instance.is_read = True  # Mark as read to avoid duplicate sends
            instance.save(update_fields=['is_read'])
            return True

    except Exception as e:
        print(f"Email sending error: {str(e)}")
        return False
