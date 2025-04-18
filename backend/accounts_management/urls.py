from django.urls import path
from .views import UserListView, UserDetailView, TechnicianCreationView, AdminCreationView

urlpatterns = [
    path('list/', UserListView.as_view(), name='user_list'),
    path('user/<int:id>/', UserDetailView.as_view(), name='user_detail'),
    path('create_technicien/', TechnicianCreationView.as_view(),
         name='create_technicien'),
    path('create_admin/',  AdminCreationView.as_view(), name='create_admin'),
]
