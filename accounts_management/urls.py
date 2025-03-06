from django.urls import path
from .views import UserListView, TechnicienCreateView, PersonnelCreateView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user_list'),
    path('create_technicien/', TechnicienCreateView.as_view(), name='create_technicien'),
    path('create_personnel/', PersonnelCreateView.as_view(), name='create_personnel'),
]