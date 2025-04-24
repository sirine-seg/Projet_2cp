from django.urls import path
from .views import (
    UserListView, UserDetailView,
    AdminListView, AdminDetailView, AdminCreateView,
    TechnicienListView, TechnicienDetailView, TechnicienCreateView,
    PersonnelListView, PersonnelDetailView, PersonnelCreateView
)

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user-detail'),

    path('admins/', AdminListView.as_view(), name='admin-list'),
    path('admins/<int:id>/', AdminDetailView.as_view(), name='admin-detail'),
    path('admins/create/', AdminCreateView.as_view(), name='admin-create'),

    path('techniciens/', TechnicienListView.as_view(), name='technicien-list'),
    path('techniciens/<int:id>/', TechnicienDetailView.as_view(),
         name='technicien-detail'),
    path('techniciens/create/', TechnicienCreateView.as_view(),
         name='technicien-create'),

    path('personnels/', PersonnelListView.as_view(), name='personnel-list'),
    path('personnels/<int:id>/', PersonnelDetailView.as_view(),
         name='personnel-detail'),
    path('personnels/create/', PersonnelCreateView.as_view(),
         name='personnel-create'),
]
