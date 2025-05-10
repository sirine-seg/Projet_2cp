from accounts_management.models import User, Admin


def promote_to_admin(email):
    """
    Promote a user to admin role
    """
    try:
        user = User.objects.get(email=email)

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
