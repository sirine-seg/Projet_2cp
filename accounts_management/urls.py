from django.urls import path
from .views import UserListView, TechnicianCreationView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user_list'),
    path('create_technicien/', TechnicianCreationView.as_view(), name='create_technicien'),
]