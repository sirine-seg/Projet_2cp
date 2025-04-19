from django.urls import path
from .views import (
    StatusInterventionListView,
    StatusInterventionCreateView,
    StatusInterventionRetrieveView,
    StatusInterventionUpdateView,
    StatusInterventionDestroyView
)

urlpatterns = [
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
]
