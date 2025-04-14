from django.urls import path
from . import views  

urlpatterns = [
    path('list/', views.InterventionListAPIView.as_view(), name='intervention_list'),
    path('Admincreate/', views.AdminInterventionCreateAPIView.as_view(), name='intervention_create'),
    path ('Personnelcreate/', views.UserInterventionCreateAPIView.as_view(), name='intervention_create') , 
    path('update/<int:pk>/', views.InterventionUpdateAPIView.as_view(), name='intervention_update'),
    path('delete/<int:pk>/', views.InterventionDeleteAPIView.as_view(), name='intervention_delete'),
    path('listInterventionAssigneTechnician/', views.TechnicianInterventionsListAPIView.as_view(), name='technician-interventions'),
    path('InterventionAssigneUpdateTechnician/<int:pk>/', views.TechnicianInterventionUpdateAPIView.as_view(), name='technician-intervention-update'),
]