from accounts_management.models import User, Technicien, Poste, Admin, Personnel


def promote_to_technician(email, poste_name=None):
    """
    Promote a user to technician role.
    If the user has any other role (admin or personnel), they will be removed from those roles first.
    Optionally assign a specific poste/position.
    """
    try:
        user = User.objects.get(email=email)

        # Remove from Admin role if exists
        try:
            admin = Admin.objects.get(user=user)
            admin.delete()
            print(f"Removed {email} from Admin role")
        except Admin.DoesNotExist:
            pass

        # Remove from Personnel role if exists
        try:
            personnel = Personnel.objects.get(user=user)
            personnel.delete()
            print(f"Removed {email} from Personnel role")
        except Personnel.DoesNotExist:
            pass

        # Update user role
        user.role = User.TECHNICIEN
        user.save()

        # Create Technicien record if it doesn't exist
        technicien, created = Technicien.objects.get_or_create(user=user)

        # Assign a poste if provided
        if poste_name:
            try:
                poste = Poste.objects.get(nom=poste_name)
                technicien.poste = poste
                technicien.save()
                print(f"Assigned poste '{poste_name}' to technician {email}")
            except Poste.DoesNotExist:
                print(
                    f"Poste '{poste_name}' does not exist. Technician created without assigned poste.")

        print(f"User {email} is now a technician")
        return True
    except User.DoesNotExist:
        print(f"User with email {email} does not exist")
        return False


promote_to_technician("nm_djabri@esi.dz")
