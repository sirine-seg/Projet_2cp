from django.core.management.base import BaseCommand
from accounts_management.models import User, Admin


class Command(BaseCommand):
    help = 'Create an admin user'

    def handle(self, *args, **options):
        try:
            email = "admin@esi.dz"
            password = "admin"

            # Create user
            user = User.objects.create_user(
                email=email,
                password=password,
                role=User.ADMIN,
                is_active=True
            )

            # Create Admin profile
            admin = Admin.objects.create(user=user)

            self.stdout.write(self.style.SUCCESS(
                f'Admin user created successfully!'))
            self.stdout.write(f'Email: {email}')
            self.stdout.write(f'Password: {password}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
