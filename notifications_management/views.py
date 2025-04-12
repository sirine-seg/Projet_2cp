from django.shortcuts import render
from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from django.http import HttpResponse
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from .serializers import NotificationSerializer
from .filters import NotificationFilter

class NotificationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class NotificationViewSet(viewsets.ModelViewSet):
    """Complete viewset for notification management"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NotificationPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = NotificationFilter
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)
    
    def perform_create(self, serializer):
        """Create a notification and send email"""
        notification = serializer.save()
        # Send email notification
        notification.send_email_notification()
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a specific notification as read"""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({"status": "notification marked as read"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all of the user's notifications as read"""
        notifications = self.get_queryset().filter(read=False)
        count = notifications.count()
        for notification in notifications:
            notification.mark_as_read()
        return Response({"status": f"{count} notifications marked as read"}, 
                       status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def mark_type_read(self, request):
        """Mark all notifications of a specific type as read"""
        notification_type = request.data.get('notification_type')
        if not notification_type:
            return Response(
                {"error": "notification_type parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        notifications = self.get_queryset().filter(
            read=False,
            notification_type=notification_type
        )
        count = notifications.count()
        for notification in notifications:
            notification.mark_as_read()
            
        return Response(
            {"status": f"{count} {notification_type} notifications marked as read"}, 
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications with breakdown by type"""
        unread_qs = self.get_queryset().filter(read=False)
        total_count = unread_qs.count()
        
        counts_by_type = {}
        for type_code, type_name in Notification.NOTIFICATION_TYPES:
            counts_by_type[type_code] = unread_qs.filter(notification_type=type_code).count()
        
        return Response({
            "total_unread": total_count,
            "by_type": counts_by_type
        })
    
    @action(detail=True, methods=['post'])
    def resend_email(self, request, pk=None):
        """Resend email notification"""
        notification = self.get_object()
        # Reset email_sent flag to allow resending
        notification.email_sent = False
        notification.save(update_fields=['email_sent'])
        # Resend the email
        if notification.send_email_notification():
            return Response({"status": "Email notification resent successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to resend email notification"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# For CRUD operations
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = NotificationFilter
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class NotificationCreateView(generics.CreateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        """Create notification and send email"""
        notification = serializer.save(recipient=self.request.user)
        # Send email notification
        notification.send_email_notification()

class NotificationDetailView(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class NotificationUpdateView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class NotificationDeleteView(generics.DestroyAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

# For filtering
class NotificationUnreadListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user, read=False)

class NotificationsByTypeView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        notification_type = self.kwargs.get('notification_type')
        return Notification.objects.filter(
            recipient=self.request.user,
            notification_type=notification_type
        )

# For read status operations
class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, recipient=request.user)
            notification.mark_as_read()
            return Response({"status": "notification marked as read"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found or you don't have permission"},
                status=status.HTTP_404_NOT_FOUND
            )

class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        notifications = Notification.objects.filter(recipient=request.user, read=False)
        count = notifications.count()
        for notification in notifications:
            notification.mark_as_read()
        return Response({"status": f"{count} notifications marked as read"}, 
                       status=status.HTTP_200_OK)

class NotificationMarkTypeReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        notification_type = request.data.get('notification_type')
        if not notification_type:
            return Response(
                {"error": "notification_type parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        notifications = Notification.objects.filter(
            recipient=request.user,
            read=False,
            notification_type=notification_type
        )
        count = notifications.count()
        for notification in notifications:
            notification.mark_as_read()
            
        return Response(
            {"status": f"{count} {notification_type} notifications marked as read"}, 
            status=status.HTTP_200_OK
        )

# For statistics
class NotificationUnreadCountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        unread_qs = Notification.objects.filter(recipient=request.user, read=False)
        total_count = unread_qs.count()
        
        counts_by_type = {}
        for type_code, type_name in Notification.NOTIFICATION_TYPES:
            counts_by_type[type_code] = unread_qs.filter(notification_type=type_code).count()
        
        return Response({
            "total_unread": total_count,
            "by_type": counts_by_type
        })

# Email testing view
def test_email(request):
    """Test view to verify email configuration"""
    try:
        # Get the first notification or create a test one
        notification = Notification.objects.first()
        
        if not notification:
            # If no notifications exist, create a test one for the request user
            if request.user.is_authenticated:
                notification = Notification.objects.create(
                    recipient=request.user,
                    title="Test Email Notification",
                    message="This is a test email notification to verify your email configuration.",
                    notification_type="reminder"
                )
            else:
                return HttpResponse("No notifications available and no authenticated user to create a test notification.", 
                                   status=400)
        
        # Reset email_sent flag
        notification.email_sent = False
        notification.save(update_fields=['email_sent'])
        
        # Send the test email
        success = notification.send_email_notification()
        
        if success:
            return HttpResponse("Test email sent successfully! Check your inbox.")
        else:
            return HttpResponse("Failed to send test email. Check your server logs for details.", status=500)
            
    except Exception as e:
        return HttpResponse(f"Error sending test email: {str(e)}", status=500)

# Signal handler to automatically send emails for new notifications
@receiver(post_save, sender=Notification)
def send_notification_email(sender, instance, created, **kwargs):
    """Send email when a new notification is created"""
    if created and not instance.email_sent:
        instance.send_email_notification()

class ResendEmailNotificationView(APIView):
    """Resend an email for a specific notification"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, recipient=request.user)
            
            # Reset email_sent flag
            notification.email_sent = False
            notification.save(update_fields=['email_sent'])
            
            # Resend the email
            if notification.send_email_notification():
                return Response(
                    {"status": "Email notification resent successfully"}, 
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Failed to resend email notification"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found or you don't have permission"},
                status=status.HTTP_404_NOT_FOUND
            )

class EmailPreferencesView(APIView):
    """Update user's email notification preferences"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current email preferences"""
        user = request.user
        
        # Check if email_notifications_enabled field exists
        if hasattr(user, 'email_notifications_enabled'):
            return Response({
                'email_notifications_enabled': user.email_notifications_enabled
            })
        else:
            # Default to True if field doesn't exist yet
            return Response({
                'email_notifications_enabled': True
            })
    
    def post(self, request):
        """Update email preferences"""
        user = request.user
        
        # Get the preference from request data
        enabled = request.data.get('email_notifications_enabled')
        
        if enabled is None:
            return Response(
                {"error": "email_notifications_enabled parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if email_notifications_enabled field exists
        if hasattr(user, 'email_notifications_enabled'):
            user.email_notifications_enabled = enabled
            user.save(update_fields=['email_notifications_enabled'])
            
            return Response({
                'status': 'Email preferences updated successfully',
                'email_notifications_enabled': user.email_notifications_enabled
            })
        else:
            # Field doesn't exist yet in model
            return Response(
                {"error": "Email preferences feature is not enabled yet"}, 
                status=status.HTTP_501_NOT_IMPLEMENTED
            )
