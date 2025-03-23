# setup_data.py
import os
import django
import sys

# Set up Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import models
from accounts_management.models import User, Technicien, Personnel, Admin
from intervention_management.models import Status
from equipements_management.models import EtatEquipement

def setup_initial_data():
    print("Creating default statuses...")
    Status.objects.get_or_create(name="Affecter")
    Status.objects.get_or_create(name="En cours")
    Status.objects.get_or_create(name="Terminé")
    
    print("Creating equipment states...")
    EtatEquipement.objects.get_or_create(nom="En service")
    EtatEquipement.objects.get_or_create(nom="En maintenance")
    
    print("Creating test users...")
    # Create admin
    admin_user, created = User.objects.get_or_create(
        email="nm_djabri@esi.dz",
        defaults={
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'Administrateur'
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        Admin.objects.get_or_create(user=admin_user)
    
    # Create technician
    tech_user, created = User.objects.get_or_create(
        email="nm_bekoul@esi.dz",
        defaults={
            'first_name': 'Tech',
            'last_name': 'User',
            'role': 'Technicien'
        }
    )
    if created:
        tech_user.set_password('tech123')
        tech_user.save()
        Technicien.objects.get_or_create(user=tech_user, defaults={'poste': 'Maintenance'})
    
    # Create personnel
    personnel_user, created = User.objects.get_or_create(
        email="personnel@test.com",
        defaults={
            'first_name': 'Personnel',
            'last_name': 'User',
            'role': 'Personnel'
        }
    )
    if created:
        personnel_user.set_password('personnel123')
        personnel_user.save()
        Personnel.objects.get_or_create(user=personnel_user)
    
    print("Setup complete!")

if __name__ == "__main__":
    setup_initial_data()