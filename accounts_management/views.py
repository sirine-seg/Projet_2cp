from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User, Technicien, Personnel
from .serializers import UserSerializer, TechnicienCreationSerializer, PersonnelCreationSerializer
from accounts_management.permissions import IsAdminUser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

@login_required
def login_success(request):
    return render(request, 'login_success.html')


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
   # permission_classes = [permissions.IsAuthenticated , IsAdminUser]     
    # filter_backends = [DjangoFilterBackend , SearchFilter]
    # filterset_fields = ['role'] 
    search_fields = ['email' , 'first_name' , 'last_name']



# Views for admins to create technicians

class TechnicianCreationView(generics.CreateAPIView):
    """Allows admins to pre-register technicians"""
    queryset = User.objects.all()
    serializer_class = TechnicienCreationSerializer
   # permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        # Create technician with email, name, etc.
        user = serializer.save(role=User.TECHNICIEN)
        
        # Create technician profile
        
        # For technicians without Google authentication
        if serializer.validated_data.get('use_password', False):
            user.set_password(serializer.validated_data.get('password'))
        else:
            # For Google auth technicians - set unusable password
            user.set_unusable_password()
        user.save()


        
class UserDetailView(generics.RetrieveAPIView):
    """
    Vue pour récupérer un utilisateur par ID
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'  # on utilise 'id' dans l'URL
    permission_classes = []  # à adapter si besoin
