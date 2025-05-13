from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from accounts_management.permissions import IsAdmin
from .models import Equipement, EtatEquipement, CategorieEquipement, TypeEquipement, LocalisationEquipement
from .serializers import (
    EquipementSerializer,
    EtatEquipementSerializer,
    CategorieEquipementSerializer,
    TypeEquipementSerializer,
    LocalisationEquipementSerializer,
    EquipementChangeEtatSerializer
)
from .filters import EquipementFilter
from rest_framework.exceptions import ValidationError


# Equipement Views
class EquipementListView(generics.ListAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EquipementFilter
    permission_classes = [IsAuthenticated]


class EquipementDetailView(generics.RetrieveAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id_equipement'


class EquipementCreateView(generics.CreateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class EquipementUpdateView(generics.UpdateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id_equipement'


class EquipementDeleteView(generics.DestroyAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id_equipement'


class EquipementChangeEtatView(generics.UpdateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementChangeEtatSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id_equipement'

    def perform_update(self, serializer):
        serializer.save(etat=serializer.validated_data.get('etat'))


# EtatEquipement Views


class EtatEquipementListView(generics.ListAPIView):
    queryset = EtatEquipement.objects.all()
    serializer_class = EtatEquipementSerializer
    permission_classes = [IsAuthenticated]


class EtatEquipementCreateView(generics.CreateAPIView):
    queryset = EtatEquipement.objects.all()
    serializer_class = EtatEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class EtatEquipementUpdateView(generics.UpdateAPIView):
    queryset = EtatEquipement.objects.all()
    serializer_class = EtatEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id'


class EtatEquipementDeleteView(generics.DestroyAPIView):
    queryset = EtatEquipement.objects.all()
    serializer_class = EtatEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id'


# CategorieEquipement Views
class CategorieEquipementListView(generics.ListAPIView):
    queryset = CategorieEquipement.objects.all()
    serializer_class = CategorieEquipementSerializer
    permission_classes = [IsAuthenticated]


class CategorieEquipementCreateView(generics.CreateAPIView):
    queryset = CategorieEquipement.objects.all()
    serializer_class = CategorieEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class CategorieEquipementUpdateView(generics.UpdateAPIView):
    queryset = CategorieEquipement.objects.all()
    serializer_class = CategorieEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id'


class CategorieEquipementDeleteView(generics.DestroyAPIView):
    queryset = CategorieEquipement.objects.all()
    serializer_class = CategorieEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id'


# TypeEquipement Views
class TypeEquipementListView(generics.ListAPIView):
    serializer_class = TypeEquipementSerializer
    permission_classes = [IsAuthenticated]
    queryset = TypeEquipement.objects.all()

    def get_queryset(self):
        queryset = TypeEquipement.objects.all()
        categorie_id = self.request.query_params.get('categorie')
        if categorie_id:
            queryset = queryset.filter(categorie__id=categorie_id)
        return queryset


class TypeEquipementCreateView(generics.CreateAPIView):
    queryset = TypeEquipement.objects.all()
    serializer_class = TypeEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class TypeEquipementUpdateView(generics.UpdateAPIView):
    queryset = TypeEquipement.objects.all()
    serializer_class = TypeEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id'


class TypeEquipementDeleteView(generics.DestroyAPIView):
    queryset = TypeEquipement.objects.all()
    serializer_class = TypeEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id'


# LocalisationEquipement Views
class LocalisationEquipementListView(generics.ListAPIView):
    queryset = LocalisationEquipement.objects.all()
    serializer_class = LocalisationEquipementSerializer
    permission_classes = [IsAuthenticated]


class LocalisationEquipementCreateView(generics.CreateAPIView):
    queryset = LocalisationEquipement.objects.all()
    serializer_class = LocalisationEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class LocalisationEquipementUpdateView(generics.UpdateAPIView):
    queryset = LocalisationEquipement.objects.all()
    serializer_class = LocalisationEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id'


class LocalisationEquipementDeleteView(generics.DestroyAPIView):
    queryset = LocalisationEquipement.objects.all()
    serializer_class = LocalisationEquipementSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
    lookup_field = 'id'
