from rest_framework import generics, permissions
from .models import Equipement 
from intervention_management.models import Intervention, InterventionRecord
from .serializers import EquipementSerializer
from accounts_management.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .filters import EquipementFilter
from intervention_management.serializers import InterventionRecordSerializer


class EquipementListView(generics.ListAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EquipementFilter
    #permission_classes = [permissions.IsAuthenticated , IsAdmin , IsTechnician] not for now


class EquipementCreateView(generics.CreateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    #permission_classes = [permissions.IsAuthenticated, IsAdminUser] not for now

class EquipementUpdateView(generics.UpdateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    #permission_classes = [permissions.IsAuthenticated, IsAdminUser] not for now

class EquipementDeleteView(generics.DestroyAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    #permission_classes = [permissions.IsAuthenticated, IsAdminUser] not for now

class EquipmentMaintenanceHistoryView(generics.ListAPIView):
    """View for historical maintenance records for a specific equipment"""
    serializer_class = InterventionRecordSerializer
    
def get_queryset(self):
    equipment_id = self.kwargs['equipment_id']
        # Get all interventions for this equipment
    interventions = Intervention.objects.filter(id_equipement__id_equipement=equipment_id)
        # Get all records for these interventions
    intervention_ids = interventions.values_list('id', flat=True)
    return InterventionRecord.objects.filter(intervention__id__in=intervention_ids).order_by('-date_action')
