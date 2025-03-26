from rest_framework import generics 
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Equipement, EtatEquipement
from intervention_management.models import Intervention 
from .serializers import EquipementSerializer, EtatEquipementSerializer
from accounts_management.permissions import IsAdminUser as IsAdmin 
from accounts_management.permissions import IsTechnician 
from django_filters.rest_framework import DjangoFilterBackend
from .filters import EquipementFilter
from rest_framework.response import Response 


class EquipementListView(generics.ListAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EquipementFilter
    permission_classes = [IsAuthenticated , IsAdmin] 


class EquipementCreateView(generics.CreateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    permission_classes = [IsAuthenticated, IsAdmin] 

class EquipementUpdateView(generics.UpdateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class EquipementDeleteView(generics.DestroyAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    permission_classes = [IsAuthenticated, IsAdmin] 


# this view is used to handle the button chnager status 
class EtatEquipementAssignAndCreateview(generics.CreateAPIView):
    queryset = EtatEquipement.objects.all()
    serializer_class = EtatEquipementSerializer
    permission_classes = [IsAuthenticated  , IsAdmin] 



# this view renders all the fields to be filtered in the frontend  , in order to choose and apply filters 
class EquipementChoicesAPIView (APIView)  : 
    """API qui retourne les categorie  , type et localisation des equipements"""
    def get(self , request) : 
        choices  = {
            "locations"  : dict (Equipement.LOCALISATION_CHOICES) , 
            "categories" : dict (Equipement.CATEGORIE_CHOICES) , 
            "types"      : dict (Equipement.TYPE_CHOICES) , 
            "etat": {etat.id: etat.nom for etat in EtatEquipement.objects.all()}  # Convert QuerySet to dictionary
            # coonvering a quey set to an iterable dictionnary ... 
        }
        return Response (choices)

class EquipementLogsAPIView (APIView) : 
    """API qui retourne les logs d'un equipement"""

