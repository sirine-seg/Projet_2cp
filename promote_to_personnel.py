from accounts_management.models import User, Personnel, Admin, Technicien


def promote_to_personnel(email):
    """
    Promote a user to personnel role.
    If the user has any other role (admin or technician), they will be removed from those roles first.
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

        # Remove from Technicien role if exists
        try:
            technicien = Technicien.objects.get(user=user)
            technicien.delete()
            print(f"Removed {email} from Technicien role")
        except Technicien.DoesNotExist:
            pass

        # Update user role
        user.role = User.PERSONNEL
        user.save()

        # Create Personnel record if it doesn't exist
        personnel, created = Personnel.objects.get_or_create(user=user)

        print(f"User {email} is now a personnel")
        return True
    except User.DoesNotExist:
        print(f"User with email {email} does not exist")
        return False


# Execute the function
promote_to_personnel("nm_djabri@esi.dz")
