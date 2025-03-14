from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Technicien, Admin, Personnel

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal handler to create the appropriate profile (Admin, Technicien, Personnel)
    when a User is created, based on their role
    """
    if created:
        # If this is a new user, create the appropriate profile
        if instance.role == User.ADMIN:
            Admin.objects.create(user=instance)
        elif instance.role == User.TECHNICIEN:
            Technicien.objects.create(user=instance, disponibilite=True, poste="Non spécifié")
        elif instance.role == User.PERSONNEL:
            Personnel.objects.create(user=instance)
    else:
        # If user role changed, update profiles accordingly
        try:
            if instance.role == User.ADMIN and not hasattr(instance, 'admin'):
                Admin.objects.create(user=instance)
            elif instance.role == User.TECHNICIEN and not hasattr(instance, 'technicien'):
                Technicien.objects.create(user=instance, disponibilite=True, poste="Non spécifié")
            elif instance.role == User.PERSONNEL and not hasattr(instance, 'personnel'):
                Personnel.objects.create(user=instance)
        except Exception as e:
            print(f"Error creating profile: {e}")
