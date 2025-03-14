from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer, TechnicienCreationSerializer, PersonnelCreationSerializer
from accounts_management.permissions import IsAdminUser

@login_required
def login_success(request):
    return render(request, 'login_success.html')


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #permission_classes = [permissions.IsAuthenticated] not for now

class TechniciansListView (generics.ListAPIView):
    queryset = User.objects.filter(role=User.TECHNICIEN)
    serializer_class = UserSerializer
    #permission_classes = [permissions.IsAuthenticated , permissions.IsTechnician] not for now

class TechnicienCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = TechnicienCreationSerializer
    #permission_classes = [permissions.IsAuthenticated, IsAdminUser] not for now

class PersonnelCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = PersonnelCreationSerializer
    #permission_classes = [permissions.IsAuthenticated, IsAdminUser] not for now 
