import django_filters
from gestion.models import User


class UserFilter(django_filters.FilterSet):

   class Meta:
        model = User
        fields = ['role', 'first_name','last_name','email']
