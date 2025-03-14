from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from gestion.models import Intervention
from .serializers import InterventionSerializer
from django.contrib import messages

class InterventionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows authenticated users to view or manage interventions.
    """
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer
    authentication_classes = []  # Add your authentication classes here
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """
        Override create method to ensure authenticated users can create interventions.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            messages.success(request, "Intervention created successfully.")
            return Response({
                'message': "Intervention created successfully.",
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        messages.error(request, "Failed to create intervention.")
        return Response({
            'message': "Failed to create intervention.",
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def my_interventions(self, request):
        """
        Custom action to get interventions assigned to the authenticated user.
        """
        interventions = Intervention.objects.filter(id_technicien__user=request.user)
        serializer = self.get_serializer(interventions, many=True)
        return Response(serializer.data)