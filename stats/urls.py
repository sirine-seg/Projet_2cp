from django.urls import path
from .views import (
    InterventionCountAPIView,
    EquipementCountAPIView,
    UserCountAPIView,
    InterventionsByMonthAPIView,
    TechnicienCountAPIView,
    EquipementPercentageByEtatAPIView,
    InterventionStatusPercentageAPIView,
    TechnicianInterventionStatusPercentageAPIView,
    DelaiMoyenResolutionAPIView,
    # plus your other views if needed
)

urlpatterns = [
    path('interventions/count/', InterventionCountAPIView.as_view(),
         name='intervention-count'),
    path('equipements/count/', EquipementCountAPIView.as_view(),
         name='equipment-count'),
    path('users/count/', UserCountAPIView.as_view(), name='user-count'),
    path('interventions/by-month/', InterventionsByMonthAPIView.as_view(),
         name='interventions-by-month'),
    path('technicians/count/', TechnicienCountAPIView.as_view(),
         name='technician-count'),
    path('equipements/percentage-by-etat/',
         EquipementPercentageByEtatAPIView.as_view(), name='equipment-percentage-by-etat'),
    path('interventions/percentage-by-status/',
         InterventionStatusPercentageAPIView.as_view(), name='intervention-status-percentage'),
    path('technicians/intervention-status-percentage/', TechnicianInterventionStatusPercentageAPIView.as_view(),
         name='technician-intervention-status-percentage'),
    path('interventions/average-resolution-time/',
         DelaiMoyenResolutionAPIView.as_view(), name='average-resolution-time'),
]
