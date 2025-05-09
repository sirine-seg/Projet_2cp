from django.urls import path
from .views import (
    UserListView, UserDetailView, UserUpdateView,
    AdminListView, AdminDetailView, TechnicienUpdateView,
    TechnicienListView, TechnicienDetailView,
    PersonnelListView, PersonnelDetailView, PosteCreateView, UserCreationAPIView,
    BlockUserView, UnblockUserView, MeAPIView, PosteListView, ToggleActivateNotificationView, ToggleActivateNotificationEmailView,
    PosteUpdateView, PosteDeleteView,
)

urlpatterns = [
    # User routes
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<int:id>/update/', UserUpdateView.as_view(), name='user-update'),
    path('user/<int:pk>/block/', BlockUserView.as_view(), name='user-block'),
    path('users/<int:pk>/unblock/', UnblockUserView.as_view(), name='user-unblock'),
    path('createUser/', UserCreationAPIView.as_view(), name='UserCreation'),
    path('me/', MeAPIView.as_view(), name='me'),

    # Admin routes
    path('admins/', AdminListView.as_view(), name='admin-list'),
    path('admins/<int:id>/', AdminDetailView.as_view(), name='admin-detail'),

    # Technicien routes
    path('techniciens/', TechnicienListView.as_view(), name='technicien-list'),
    path('techniciens/<int:id>/', TechnicienDetailView.as_view(),
         name='technicien-detail'),
    path('techniciens/<int:id>/update/',
         TechnicienUpdateView.as_view(), name='technicien-update'),

    # Personnel routes
    path('personnels/', PersonnelListView.as_view(), name='personnel-list'),
    path('personnels/<int:id>/', PersonnelDetailView.as_view(),
         name='personnel-detail'),

    # Poste routes
    path('postes/', PosteListView.as_view(), name='poste-list'),
    path('postes/create/', PosteCreateView.as_view(), name='poste-create'),
    path('postes/<int:id>/update/', PosteUpdateView.as_view(), name='poste-update'),
    path('postes/<int:id>/delete/', PosteDeleteView.as_view(), name='poste-delete'),

    # Notification settings routes
    path('toggle-notification/<int:id>/',
         ToggleActivateNotificationView.as_view(), name='toggle-notification'),
    path('toggle-notification-email/<int:id>/',
         ToggleActivateNotificationEmailView.as_view(), name='toggle-notification-email'),
]
