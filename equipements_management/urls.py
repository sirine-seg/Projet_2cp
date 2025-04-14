from django.urls import path
from .views import EquipementListView, EquipementCreateView,EquipementDetailView,EtatEquipementListView, EquipementUpdateView, EquipementDeleteView ,  EtatEquipementAssignAndCreateview  , EquipementChoicesAPIView 
from intervention_management.views import EquipementLogs

urlpatterns = [
    path('equipements_list/', EquipementListView.as_view(), name='equipement_list'),
    path('create/', EquipementCreateView.as_view(), name='equipement_create'),
    path('update/<str:pk>/', EquipementUpdateView.as_view(), name='equipement_update'),
    path('delete/<int:pk>/', EquipementDeleteView.as_view(), name='equipement_delete'),
    path ('changerStatus/<int:pk>' ,EtatEquipementAssignAndCreateview.as_view() , name = 'equipement_status_changer' )     , 
    path('equipementchoices/' , EquipementChoicesAPIView.as_view () , name = 'equipemnt_choices_choose') , 
    path('logs/<int:pk>', EquipementLogs.as_view(), name="intervention-logs"),
     path('<str:id_equipement>/', EquipementDetailView.as_view(), name='equipement-detail'),
      path('etatoptions/', EtatEquipementListView.as_view(), name='etat-equipement-list'),
]


