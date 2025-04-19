from rest_framework import generics
from .models import StatusIntervention
from .serializers import StatusInterventionSerializer


# List and Create View
class StatusInterventionListView(generics.ListAPIView):
    """
    View to list all StatusIntervention objects.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer


class StatusInterventionCreateView(generics.CreateAPIView):
    """
    View to create a new StatusIntervention object.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer


# Retrieve, Update, and Destroy View
class StatusInterventionRetrieveView(generics.RetrieveAPIView):
    """
    View to retrieve a specific StatusIntervention object.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer


class StatusInterventionUpdateView(generics.UpdateAPIView):
    """
    View to update a specific StatusIntervention object.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer


class StatusInterventionDestroyView(generics.DestroyAPIView):
    """
    View to delete a specific StatusIntervention object.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer
