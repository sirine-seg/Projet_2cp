from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets,filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer
from .filter import UserFilter
from gestion.models import User


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserListView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class =UserFilter
