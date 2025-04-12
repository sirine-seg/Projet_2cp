import django_filters
from .models import Notification

class NotificationFilter(django_filters.FilterSet):
    read = django_filters.BooleanFilter(field_name='read')
    notification_type = django_filters.ChoiceFilter(choices=Notification.NOTIFICATION_TYPES)
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Notification
        fields = ['read', 'notification_type', 'recipient']