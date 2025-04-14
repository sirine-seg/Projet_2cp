from django.urls import path
from .views import UserListView, TechnicianCreationView, UserDetailView

urlpatterns = [
    path('', UserListView.as_view(), name='user_list'),
    path('create_technicien/', TechnicianCreationView.as_view(), name='create_technicien'),
    path('user/<int:id>/', UserDetailView.as_view(), name='user_detail'), 
]