from accounts_management.models import User, Admin, Technicien, Personnel


def promote_to_admin(email):
    """
    Promote a user to admin role by:
    1. Changing user role to Admin
    2. Creating Admin record
    3. Removing previous role record (Technicien or Personnel)
    """
    try:
        user = User.objects.get(email=email)

        # Delete previous role record
        if user.role == User.TECHNICIEN:
            try:
                Technicien.objects.get(user=user).delete()
                print(f"Removed Technicien record for {email}")
            except Technicien.DoesNotExist:
                print(f"Warning: User has Technicien role but no Technicien record")
        elif user.role == User.PERSONNEL:
            try:
                Personnel.objects.get(user=user).delete()
                print(f"Removed Personnel record for {email}")
            except Personnel.DoesNotExist:
                print(f"Warning: User has Personnel role but no Personnel record")

        # Update user role
        user.role = User.ADMIN
        user.save()

        # Create Admin record if it doesn't exist
        admin, created = Admin.objects.get_or_create(user=user)

        print(f"User {email} is now an administrator")
        return True
    except User.DoesNotExist:
        print(f"User with email {email} does not exist")
        return False


# Execute the function
promote_to_admin("ni_touadi@esi.dz")
