from rest_framework import viewsets, status
from rest_framework.response import Response
from gestion.models import Equipement
from .serializers import EquipementSerializer

class EquipementViewSet(viewsets.ModelViewSet):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': "Equipement created successfully.",
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': "Failed to create equipement.",
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)