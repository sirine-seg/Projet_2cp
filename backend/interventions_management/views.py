from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
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


# -------------------- StatusIntervention Views --------------------

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


# -------------------- InterventionPreventive Views --------------------

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


# -------------------- AdminInterventionCurrative Views --------------------

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


class InterventionCurrativeRetrieveView(generics.RetrieveAPIView):
    """
    View to retrieve a specific InterventionCurrative object.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = AdminInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_object(self):
        """
        Override the get_object method to check if the intervention is active.
        """
        obj = super().get_object()
        if not obj.blocked:
            # If the intervention is not blocked, it is considered active
            raise PermissionDenied("This intervention is no longer active.")
        return obj


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


# -------------------- PersonnelInterventionCurrative Views --------------------

class PersonnelInterventionCurrativeListView(generics.ListAPIView):
    """
    View to list all InterventionCurrative objects signaled by the authenticated personnel.
    """
    serializer_class = PersonnelInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsPersonnel]

    def get_queryset(self):
        """
        Return only the interventions signaled by the authenticated personnel.
        """
        user = self.request.user
        return InterventionCurrative.objects.filter(user=user)


class PersonnelInterventionCurrativeCreateView(generics.CreateAPIView):
    """
    View to create a new InterventionCurrative object.
    """
    queryset = InterventionCurrative.objects.all()
    serializer_class = PersonnelInterventionCurrativeSerializer
    permission_classes = [IsAuthenticated, IsPersonnel]
