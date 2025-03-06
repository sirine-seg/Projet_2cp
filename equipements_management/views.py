from rest_framework import generics, permissions
from gestion.models import Equipement
from equipements_management.serializers import EquipementSerializer
from accounts_management.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .filters import EquipementFilter


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

