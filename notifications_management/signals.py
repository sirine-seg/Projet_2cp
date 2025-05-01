from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Notification


@receiver(post_save, sender=Notification)
def send_email_notification(sender, instance, created, **kwargs):
    """
    Signal to send an email notification when a new Notification is created.
    """
    if created:
        subject = instance.title
        message = instance.message
        recipient_email = instance.user.email

        send_mail(
            subject=subject,
            message=message,
            from_email='esitrack@esi.dz',
            recipient_list=[recipient_email],
            fail_silently=False,
        )
