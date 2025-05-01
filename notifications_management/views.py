from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from notifications_management.models import Notification
from notifications_management.serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """
    API view to list all notifications for the authenticated user.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class NotificationCreateView(generics.CreateAPIView):
    """
    API view to create a new notification.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.notifications.filter(is_active=True).exists():
            serializer.save(user=self.request.user)
        else:
            raise PermissionError("Notifications are disabled for this user.")


class NotificationMarkAsReadView(APIView):
    """
    API view to mark a notification as read using a PATCH request.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            notification.mark_as_read()
            return Response({
                'success': True,
                'message': 'Notification marked as read.',
                'notification': {
                    'id': notification.id,
                    'title': notification.title,
                    'is_read': notification.is_read,
                }
            })
        except Notification.DoesNotExist:
            return Response({'success': False, 'error': 'Notification not found.'}, status=404)