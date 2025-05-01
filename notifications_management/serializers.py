from rest_framework import serializers
from notifications_management.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id',
            'user',
            'title',
            'notification_type',
            'message',
            'created_at',
            'is_read',
            'url',
            'is_active',
        ]
        read_only_fields = ['id', 'created_at', 'user']
