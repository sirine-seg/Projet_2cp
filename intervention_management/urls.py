from django.urls import path
# Change this in urls.py
from .views import (
    InterventionRecordListView,  # NOT MaintenanceRecordListView
    InterventionRecordDetailView, 
    InterventionRecordCreateView,
    InterventionRecordUpdateView,
    InterventionRecordDeleteView,
    InterventionRecordsByEquipmentView,
    InterventionRecordsByInterventionView
)

urlpatterns = [
    # Update URL patterns to use the correct view names
    path('records/', InterventionRecordListView.as_view(), name='intervention_record_list'),
    path('records/<int:pk>/', InterventionRecordDetailView.as_view(), name='intervention_record_detail'),
    path('records/create/', InterventionRecordCreateView.as_view(), name='intervention_record_create'),
    path('records/update/<int:pk>/', InterventionRecordUpdateView.as_view(), name='intervention_record_update'),
    path('records/delete/<int:pk>/', InterventionRecordDeleteView.as_view(), name='intervention_record_delete'),
    path('equipment/<int:equipment_id>/records/', InterventionRecordsByEquipmentView.as_view(), 
         name='equipment_intervention_records'),
    path('intervention/<int:intervention_id>/records/', InterventionRecordsByInterventionView.as_view(), 
         name='intervention_records'),
]