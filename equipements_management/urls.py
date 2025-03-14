from django.urls import path
from .views import EquipementListView, EquipementCreateView, EquipementUpdateView, EquipementDeleteView

urlpatterns = [
    path('equipements_list/', EquipementListView.as_view(), name='equipement_list'),
    path('create/', EquipementCreateView.as_view(), name='equipement_create'),
    path('update/<int:pk>/', EquipementUpdateView.as_view(), name='equipement_update'),
    path('delete/<int:pk>/', EquipementDeleteView.as_view(), name='equipement_delete'),
]


