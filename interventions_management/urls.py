from django.urls import path
from .views import (
    InterventionListView,
    InterventionDetailView,
    InterventionPreventiveListView,
    InterventionPreventiveCreateView,
    InterventionPreventiveDetailView,
    InterventionPreventiveUpdateView,
    InterventionCurrativeListView,
    InterventionCurrativeCreateView,
    InterventionCurrativeDetailView,
    InterventionCurrativeUpdateView,
    InterventionCancelView,
    StatusInterventionListView,
    StatusInterventionCreateView
)

urlpatterns = [
    path('interventions/', InterventionListView.as_view(),
         name='intervention-list'),
    path('interventions/<int:pk>/', InterventionDetailView.as_view(),
         name='intervention-detail'),

    path('interventions/preventive/', InterventionPreventiveListView.as_view(),
         name='intervention-preventive-list'),
    path('interventions/preventive/create/', InterventionPreventiveCreateView.as_view(),
         name='intervention-preventive-create'),
    path('interventions/preventive/<int:pk>/',
         InterventionPreventiveDetailView.as_view(), name='intervention-preventive-detail'),
    path('interventions/preventive/update/<int:pk>/',
         InterventionPreventiveUpdateView.as_view(), name='intervention-preventive-update'),

    path('interventions/currative/', InterventionCurrativeListView.as_view(),
         name='intervention-currative-list'),
    path('interventions/currative/create/', InterventionCurrativeCreateView.as_view(),
         name='intervention-currative-create'),
    path('interventions/currative/<int:pk>/',
         InterventionCurrativeDetailView.as_view(), name='intervention-currative-detail'),
    path('interventions/currative/update/<int:pk>/',
         InterventionCurrativeUpdateView.as_view(), name='intervention-currative-update'),
    path('interventions/cancel/<str:type>/<int:pk>/',
         InterventionCancelView.as_view(), name='intervention-cancel'),

    path('interventions/status/', StatusInterventionListView.as_view(),
         name='status-intervention-list'),
    path('interventions/status/create/', StatusInterventionCreateView.as_view(),
         name='status-intervention-create'),
]