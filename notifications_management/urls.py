from django.urls import path
from .views import (
    NotificationListView,
    NotificationCreateView,
    NotificationMarkAsReadView,
)

urlpatterns = [
    path('notifications/', NotificationListView.as_view(),
         name='notification-list'),
    path('notifications/create/', NotificationCreateView.as_view(),
         name='notification-create'),
    path('notifications/<int:pk>/mark-as-read/',
         NotificationMarkAsReadView.as_view(), name='notification-mark-as-read'),
]
