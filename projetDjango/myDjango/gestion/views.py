from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets,filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Equipement
from .serializers import EquipementSerializer

class EquipementViewSet(viewsets.ModelViewSet):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
