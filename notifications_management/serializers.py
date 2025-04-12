from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 
                  'created_at', 'read', 'read_at', 'url']
        read_only_fields = ['id', 'created_at', 'read_at']
