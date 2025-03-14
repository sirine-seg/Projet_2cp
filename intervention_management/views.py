from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import InterventionRecord
from .serializers import InterventionRecordSerializer
from accounts_management.permissions import IsAdminUser
from .filters import InterventionRecordFilter

class InterventionRecordListView(generics.ListAPIView):
    """
    API view for listing all intervention records.
    Can be filtered by equipment ID using query parameter.
    """
    serializer_class = InterventionRecordSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = InterventionRecordFilter
    search_fields = ['description', 'actions_effectuees']
    ordering_fields = ['date_action', 'intervention__id_equipement', 'type_maintenance']
    
    def get_queryset(self):
        """
        Optionally restricts the returned records to a given equipment.
        """
        queryset = InterventionRecord.objects.all()
        equipment_id = self.request.query_params.get('equipment_id')
        if equipment_id is not None:
            queryset = queryset.filter(intervention__id_equipement__id_equipement=equipment_id)
        return queryset

class InterventionRecordDetailView(generics.RetrieveAPIView):
    """API view for retrieving a single intervention record."""
    queryset = InterventionRecord.objects.all()
    serializer_class = InterventionRecordSerializer

class InterventionRecordCreateView(generics.CreateAPIView):
    """API view for creating an intervention record."""
    queryset = InterventionRecord.objects.all()
    serializer_class = InterventionRecordSerializer
    # permission_classes = [permissions.IsAuthenticated, IsAdminUser]  # Uncomment when ready

class InterventionRecordUpdateView(generics.UpdateAPIView):
    """API view for updating an intervention record."""
    queryset = InterventionRecord.objects.all()
    serializer_class = InterventionRecordSerializer
    # permission_classes = [permissions.IsAuthenticated, IsAdminUser]  # Uncomment when ready

class InterventionRecordDeleteView(generics.DestroyAPIView):
    """API view for deleting an intervention record."""
    queryset = InterventionRecord.objects.all()
    serializer_class = InterventionRecordSerializer
    # permission_classes = [permissions.IsAuthenticated, IsAdminUser]  # Uncomment when ready

class InterventionRecordsByEquipmentView(generics.ListAPIView):
    """API view for listing intervention records for a specific equipment."""
    serializer_class = InterventionRecordSerializer
    
    def get_queryset(self):
        equipment_id = self.kwargs['equipment_id']
        return InterventionRecord.objects.filter(intervention__id_equipement__id_equipement=equipment_id)

class InterventionRecordsByInterventionView(generics.ListAPIView):
    """API view for listing all records for a specific intervention."""
    serializer_class = InterventionRecordSerializer
    
    def get_queryset(self):
        intervention_id = self.kwargs['intervention_id']
        return InterventionRecord.objects.filter(intervention__id=intervention_id)