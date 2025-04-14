from accounts_management.models import User, Admin

def create_admin(email, first_name, last_name, password=None):
    """Create an admin user that will authenticate via Google"""
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        print(f"User with email {email} already exists")
        return None
        
    # Create user with admin role
    user = User.objects.create(
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=User.ADMIN,
        is_staff=True  # Give Django admin access if needed
    )
    
    # Set password if provided, otherwise make unusable
    if password:
        user.set_password(password)
    else:
        user.set_unusable_password()
    user.save()
    
    # Create Admin profile
    Admin.objects.create(user=user)
    print(f"Admin created successfully: {email}")
    return user