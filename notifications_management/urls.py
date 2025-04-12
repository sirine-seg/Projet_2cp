from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    # Basic CRUD operations
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('create/', views.NotificationCreateView.as_view(), name='notification-create'),
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('<int:pk>/update/', views.NotificationUpdateView.as_view(), name='notification-update'),
    path('<int:pk>/delete/', views.NotificationDeleteView.as_view(), name='notification-delete'),
    
    # Read status operations
    path('<int:pk>/mark-read/', views.NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('mark-all-read/', views.NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('mark-type-read/', views.NotificationMarkTypeReadView.as_view(), name='notification-mark-type-read'),
    
    # Filtering endpoints
    path('unread/', views.NotificationUnreadListView.as_view(), name='notification-unread'),
    path('by-type/<str:notification_type>/', views.NotificationsByTypeView.as_view(), name='notifications-by-type'),
    
    # Statistics endpoints
    #path('unread-count/', views.NotificationUnreadCountView.as_view(), name='notification-unread-count'),
    
    # Email operation endpoints
    path('test-email/', views.test_email, name='test-email'),
    path('<int:pk>/resend-email/', views.ResendEmailNotificationView.as_view(), name='resend-email'),
    path('email-preferences/', views.EmailPreferencesView.as_view(), name='email-preferences'),
]