from django.urls import path
from .views import EquipementListView, EquipementCreateView, EquipementUpdateView, EquipementDeleteView , EtatEquipementCreateView

urlpatterns = [
    path('equipements_list/', EquipementListView.as_view(), name='equipement_list'),
    path('create/', EquipementCreateView.as_view(), name='equipement_create'),
    path('update/<int:pk>/', EquipementUpdateView.as_view(), name='equipement_update'),
    path('delete/<int:pk>/', EquipementDeleteView.as_view(), name='equipement_delete'),
    path('etat-equipement/create/', EtatEquipementCreateView.as_view(), name='etat_equipement_create'),
]


