from django.urls import path
from .views import (
    # StatusIntervention Views
    StatusInterventionListView,
    StatusInterventionCreateView,
    StatusInterventionRetrieveView,
    StatusInterventionUpdateView,
    StatusInterventionDestroyView,

    # InterventionPreventive Views
    InterventionPreventiveListView,
    InterventionPreventiveCreateView,
    InterventionPreventiveRetrieveView,
    InterventionPreventiveUpdateView,
    InterventionPreventiveDestroyView,

    # AdminInterventionCurrative Views
    AdminInterventionCurrativeListView,
    AdminInterventionCurrativeCreateView,
    InterventionCurrativeRetrieveView,
    InterventionCurrativeUpdateView,
    InterventionCurrativeDestroyView,

    # PersonnelInterventionCurrative Views
    PersonnelInterventionCurrativeListView,
    PersonnelInterventionCurrativeCreateView,
)

urlpatterns = [
    # StatusIntervention URLs
    path('status-interventions/', StatusInterventionListView.as_view(),
         name='status-intervention-list'),
    path('status-interventions/create/', StatusInterventionCreateView.as_view(),
         name='status-intervention-create'),
    path('status-interventions/<int:pk>/', StatusInterventionRetrieveView.as_view(),
         name='status-intervention-retrieve'),
    path('status-interventions/<int:pk>/update/',
         StatusInterventionUpdateView.as_view(), name='status-intervention-update'),
    path('status-interventions/<int:pk>/delete/',
         StatusInterventionDestroyView.as_view(), name='status-intervention-delete'),

    # InterventionPreventive URLs
    path('intervention-preventives/', InterventionPreventiveListView.as_view(),
         name='intervention-preventive-list'),
    path('intervention-preventives/create/', InterventionPreventiveCreateView.as_view(),
         name='intervention-preventive-create'),
    path('intervention-preventives/<int:pk>/', InterventionPreventiveRetrieveView.as_view(),
         name='intervention-preventive-retrieve'),
    path('intervention-preventives/<int:pk>/update/',
         InterventionPreventiveUpdateView.as_view(), name='intervention-preventive-update'),
    path('intervention-preventives/<int:pk>/delete/',
         InterventionPreventiveDestroyView.as_view(), name='intervention-preventive-delete'),

    # AdminInterventionCurrative URLs
    path('admin/intervention-curratives/', AdminInterventionCurrativeListView.as_view(),
         name='admin-intervention-currative-list'),
    path('admin/intervention-curratives/create/', AdminInterventionCurrativeCreateView.as_view(),
         name='admin-intervention-currative-create'),
    path('admin/intervention-curratives/<int:pk>/', InterventionCurrativeRetrieveView.as_view(),
         name='admin-intervention-currative-retrieve'),
    path('admin/intervention-curratives/<int:pk>/update/',
         InterventionCurrativeUpdateView.as_view(), name='admin-intervention-currative-update'),
    path('admin/intervention-curratives/<int:pk>/delete/',
         InterventionCurrativeDestroyView.as_view(), name='admin-intervention-currative-delete'),

    # PersonnelInterventionCurrative URLs
    path('personnel/intervention-curratives/', PersonnelInterventionCurrativeListView.as_view(),
         name='personnel-intervention-currative-list'),
    path('personnel/intervention-curratives/create/', PersonnelInterventionCurrativeCreateView.as_view(),
         name='personnel-intervention-currative-create'),
]
