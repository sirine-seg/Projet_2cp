from django.urls import path
from .views import (
    StatusInterventionListCreateView,
    StatusInterventionDetailView,
    InterventionPreventiveListCreateView,
    InterventionPreventiveDetailView,
    AdminInterventionCurrativeListCreateView,
    AdminInterventionCurrativeDetailView,
    PersonnelInterventionCurrativeListView,
    PersonnelInterventionCurrativeCreateView,
    TechnicianInterventionListView,
    AllInterventionsListView,
    InterventionPreventiveUpdateView,
    InterventionCurrativeUpdateView,
)

urlpatterns = [
    # Status endpoints
    path('status/', StatusInterventionListCreateView.as_view(),
         name='status-list-create'),
    path('status/<int:pk>/', StatusInterventionDetailView.as_view(),
         name='status-detail'),

    # Preventive interventions
    path('preventive/', InterventionPreventiveListCreateView.as_view(),
         name='preventive-list-create'),
    path('preventive/<int:intervention_id>/',
         InterventionPreventiveDetailView.as_view(), name='preventive-detail'),
    path('preventive/<int:pk>/update/',
         InterventionPreventiveUpdateView.as_view(), name='preventive-update'),

    # Curative interventions - Admin
    path('currative/admin/', AdminInterventionCurrativeListCreateView.as_view(),
         name='admin-currative-list-create'),
    path('currative/admin/<int:intervention_id>/',
         AdminInterventionCurrativeDetailView.as_view(), name='admin-currative-detail'),

    # Curative interventions - Personnel
    path('currative/personnel/', PersonnelInterventionCurrativeListView.as_view(),
         name='personnel-currative-list'),
    path('currative/personnel/create/', PersonnelInterventionCurrativeCreateView.as_view(),
         name='personnel-currative-create'),

    # Curative interventions - Update
    path('currative/<int:pk>/update/',
         InterventionCurrativeUpdateView.as_view(), name='currative-update'),

    # Technician view
    path('technician/', TechnicianInterventionListView.as_view(),
         name='technician-interventions'),

    # All interventions
    path('all/', AllInterventionsListView.as_view(), name='all-interventions'),
]
