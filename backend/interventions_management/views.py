from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts_management.permissions import IsAdmin, IsTechnician, IsPersonnel
from .models import StatusIntervention, InterventionPreventive, InterventionCurrative
from .serializers import (
    StatusInterventionSerializer,
    InterventionPreventiveSerializer,
    InterventionPreventiveUpdateSerializer,
    AdminInterventionCurrativeSerializer,
    PersonnelInterventionCurrativeSerializer,
    InterventionCurrativeUpdateSerializer,
)


class StatusInterventionListView(generics.ListAPIView):
    """
    View to list all StatusIntervention objects.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class StatusInterventionCreateView(generics.CreateAPIView):
    """
    View to create a new StatusIntervention object.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class StatusInterventionRetrieveView(generics.RetrieveAPIView):
    """
    View to retrieve a specific StatusIntervention object.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class StatusInterventionUpdateView(generics.UpdateAPIView):
    """
    View to update a specific StatusIntervention object.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class StatusInterventionDestroyView(generics.DestroyAPIView):
    """
    View to delete a specific StatusIntervention object.
    """
    queryset = StatusIntervention.objects.all()
    serializer_class = StatusInterventionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class InterventionPreventiveListView(generics.ListAPIView):
    """
    View to list all InterventionPreventive objects.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class InterventionPreventiveCreateView(generics.CreateAPIView):
    """
    View to create a new InterventionPreventive object.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class InterventionPreventiveRetrieveView(generics.RetrieveAPIView):
    """
    View to retrieve a specific InterventionPreventive object.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class InterventionPreventiveUpdateView(generics.UpdateAPIView):
    """
    View to update a specific InterventionPreventive object.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveUpdateSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class InterventionPreventiveDestroyView(generics.DestroyAPIView):
    """
    View to delete a specific InterventionPreventive object.
    """
    queryset = InterventionPreventive.objects.all()
    serializer_class = InterventionPreventiveSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AdminInterventionCurrativeListView(generics.ListAPIView):
    """
    View to list all InterventionCurrative objects.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AdminInterventionCurrativeCreateView(generics.CreateAPIView):
    """
    View to create a new InterventionCurrative object.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class PersonnelInterventionCurrativeListView(generics.ListAPIView):
    """
    View to list all InterventionCurrative objects.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = PersonnelInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsPersonnel]


class AdminInterventionCurrativeCreateView(generics.CreateAPIView):
    """
    View to create a new InterventionCurrative object.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsPersonnel]


class InterventionCurrativeRetrieveView(generics.RetrieveAPIView):
    """
    View to retrieve a specific InterventionCurrative object.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class InterventionCurrativeUpdateView(generics.UpdateAPIView):
    """
    View to update a specific InterventionCurrative object.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = InterventionCurrativeUpdateSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class InterventionCurrativeDestroyView(generics.DestroyAPIView):
    """
    View to delete a specific InterventionCurrative object.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
