from rest_framework import generics  , status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Equipement, EtatEquipement
from intervention_management.models import Intervention  , Status
from .serializers import EquipementSerializer, EtatEquipementSerializer
from accounts_management.permissions import IsAdminUser as IsAdmin 
from accounts_management.permissions import IsTechnician 
from django_filters.rest_framework import DjangoFilterBackend
from .filters import EquipementFilter
from rest_framework.response import Response 
from django.shortcuts import get_object_or_404 
from intervention_management.serializers import AdminInterventionSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import EtatEquipementSerializer




class EquipementListView(generics.ListAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EquipementFilter
   # permission_classes = [IsAuthenticated , IsAdmin] 

class EquipementDetailView(generics.RetrieveAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    lookup_field = 'id_equipement'  # or 'pk' if you're using the default id field
    # permission_classes = [IsAuthenticated, IsAdmin]
   



class EquipementCreateView(generics.CreateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
    parser_classes = [MultiPartParser, FormParser] 
   # permission_classes = [IsAuthenticated, IsAdmin] 

class EquipementUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
  #  permission_classes = [IsAuthenticated, IsAdmin]

class EquipementDeleteView(generics.DestroyAPIView):
    queryset = Equipement.objects.all()
    serializer_class = EquipementSerializer
   # permission_classes = [IsAuthenticated, IsAdmin] 


# this view is used to handle the button chnager status 
class EtatEquipementAssignAndCreateview(generics.CreateAPIView):
    queryset = EtatEquipement.objects.all()
    serializer_class = EtatEquipementSerializer
   # permission_classes = [IsAuthenticated  , IsAdmin] 



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
    




class EtatEquipementListView(APIView):
    def get(self, request):
        etats = EtatEquipement.objects.all()
        serializer = EtatEquipementSerializer(etats, many=True)
        return Response(serializer.data)



class EquipementLogsAPIView (APIView) : 
    """API qui retourne les logs d'un equipement"""
    def get (self , request  , id_equipement) : 
        # retrieve the equipement instance 404 
        # 
        equipement = get_object_or_404(Equipement  , id = id_equipement) 

        # fetch "Terminée" and "Annulée" status 
        termine_status = Status.objects.filter(name="Terminé").first()
        annule_status  = Status.objects.filter(name="Annulé").first()

        if not termine_status or not annule_status  : 
            return Response ({"error" : "Statueses 'Terminée' or 'Annulée' not found"})
        
        # filter the interventions related to the equipement  
        intervention = Intervention.objects.filter(equipement=equipement,statut__in=[termine_status, annule_status]).order_by("date_fin")

        

        # serilaize the intervetnion 
        data  =  AdminInterventionSerializer (intervention , many =  True).data  
        return Response (data , status = status.HTTP_200_ok)


