from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User, Technicien
from .serializers import UserSerializer, TechnicienCreationSerializer, PersonnelCreationSerializer
from accounts_management.permissions import IsAdmin
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserFilter


@login_required
def login_success(request):
    return render(request, 'login_success.html')


class UserListView(generics.ListAPIView):
    """
    API view to list all users with filtering options.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter
    permission_classes = [IsAdmin, IsAuthenticated]


class UserDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a user by their ID.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]


class TechnicianCreationView(generics.CreateAPIView):
    """
    API view that allows administrators to create technician accounts.
    """
    queryset = User.objects.all()
    serializer_class = TechnicienCreationSerializer
    permission_classes = [IsAdmin, IsAuthenticated]

    def perform_create(self, serializer):
        user = serializer.save(role=User.TECHNICIEN)

        Technicien.objects.create(
            user=user,
            disponibilite=serializer.validated_data.get('disponibilite', True),
            poste=serializer.validated_data.get('poste', '')
        )

        if serializer.validated_data.get('use_password', False):
            user.set_password(serializer.validated_data.get('password'))
        else:
            user.set_unusable_password()
        user.save()


class AdminCreationView(generics.CreateAPIView):
    """
    API view that allows administrators to create admin accounts.
    """
    queryset = User.objects.all()
    serializer_class = TechnicienCreationSerializer
    permission_classes = [IsAdmin, IsAuthenticated]

    def perform_create(self, serializer):
        user = serializer.save(role=User.ADMIN)

        if serializer.validated_data.get('use_password', False):
            user.set_password(serializer.validated_data.get('password'))
        else:
            user.set_unusable_password()
        user.save()
