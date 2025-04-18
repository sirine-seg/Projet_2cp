from django.urls import path
from .views import (
    InterventionPreventiveListView,
    InterventionCurrativeListView,
    AllInterventionsListView,
    UserInterventionCreateAPI,
    AdminInterventionCreateAPI,
    InterventionCurrativeUpdateView,
    InterventionPreventiveUpdateView,
)

urlpatterns = [

    path('list/preventive', InterventionPreventiveListView.as_view(),
         name='preventive-list'),
    path('list/currative/', InterventionCurrativeListView.as_view(),
         name='currative-list'),
    path('list/all/', AllInterventionsListView.as_view(), name='all-interventions'),

    path('update/preventive/<int:pk>/',
         InterventionPreventiveUpdateView.as_view(), name='preventive-update'),
    path('update/currative/<int:pk>/',
         InterventionCurrativeUpdateView.as_view(), name='currative-update'),

    path('create/user/', UserInterventionCreateAPI.as_view(),
         name='user-intervention-create'),
    path('create/admin/', AdminInterventionCreateAPI.as_view(),
         name='admin-intervention-create'),
]
