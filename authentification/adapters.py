from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from accounts_management.models import User, Personnel
from allauth.account.utils import perform_login , user_field


class ESIDZAccountAdapter(DefaultAccountAdapter):
    """Custom account adapter for ESIDZ"""

    def save_user(self, request, user, form, commit=True):  # Fixed commit=False → commit=True
        user = super().save_user(request, user, form, commit=False)
        # Default all esi registration to personnel
        user.role = User.PERSONNEL
        if commit:
            user.save()
            # create Personnel profile
            Personnel.objects.create(user=user)
        return user


class ESIDZSocialAccountAdapter(DefaultSocialAccountAdapter):
    """custom adapter for social account handling"""

    def pre_social_login(self, request, sociallogin):
        """called after successful authentication but before login"""
        email = sociallogin.account.extra_data.get('email', '')

        # Check if user already exists with that email (regardless of domain)
        if email:
            try:
                user = User.objects.get(email=email)
                # Connect the social account to the existing user
                sociallogin.connect(request, user)

                try:
                    picture_url = sociallogin.account.extra_data['picture']
                    user_field(user, "photo", picture_url)
                    user.save ()
                except (KeyError, AttributeError):
                    pass



                # Set state to avoid the intermediate confirmation page
                sociallogin.state['process'] = 'login'

                # Ensure the account gets saved
                #   sociallogin.save(request)

                # Optional: force login immediately

                perform_login(request, user, 'none')

            except User.DoesNotExist:
                # New user - will be created in save_user
                pass

    def populate_user(self, request, sociallogin, data):
        print("populate_user method called")  # Add this

        user = super().populate_user(request, sociallogin, data)
        try:
            picture_url = sociallogin.account.extra_data['picture']
            user_field(user, "photo", picture_url)
        except (KeyError, AttributeError):
            pass
        return user


    def save_user(self, request, sociallogin, form=None):  # Fixed socialllogin → sociallogin
        user = super().save_user(request, sociallogin, form)

        # if this is a new user, create Personnel profile
        if not hasattr(user, 'personnel'):  # Fixed hassattr → hasattr
            if user.role == User.PERSONNEL or not user.role:
                user.role = User.PERSONNEL
                user.save()
                Personnel.objects.create(user=user)

        return user
