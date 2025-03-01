from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets,filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Equipement
from .serializers import EquipementSerializer
from .filter import EquipementFilter



class EquipementViewSet(viewsets.ModelViewSet):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer




class EquipementListView(viewsets.ModelViewSet):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EquipementFilter


