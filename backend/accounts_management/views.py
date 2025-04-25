from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Admin, Technicien, Personnel, User, Poste
from .serializers import AdminSerializer, TechnicienSerializer, PersonnelSerializer, UserSerializer, PosteSerializer
from .filters import UserFilter, TechnicienFilter
from accounts_management.permissions import IsAdmin, IsTechnician, IsPersonnel


# User Views
class UserListView(generics.ListAPIView):
    """
    API view to list all User accounts with filtering options.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = UserFilter
    search_fields = ['email', 'first_name', 'last_name']
    permission_classes = [IsAdmin, IsAuthenticated]


class UserDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a User account by its ID.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]


# Admin Views
class AdminListView(generics.ListAPIView):
    """
    API view to list all Admin accounts with filtering options.
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class AdminDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve an Admin account by its ID.
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]


class AdminCreateView(generics.CreateAPIView):
    """
    API view to create an Admin account.
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class AdminUpdateView(generics.UpdateAPIView):
    """
    API view to update an Admin account.
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]


# Technicien Views
class TechnicienListView(generics.ListAPIView):
    """
    API view to list all Technicien accounts with filtering options.
    """
    queryset = Technicien.objects.all()
    serializer_class = TechnicienSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TechnicienFilter
    permission_classes = [IsAdmin, IsAuthenticated]


class TechnicienDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a Technicien account by its ID.
    """
    queryset = Technicien.objects.all()
    serializer_class = TechnicienSerializer
    lookup_field = 'id'
    permission_classes = [IsTechnician | IsAdmin, IsAuthenticated]


class TechnicienCreateView(generics.CreateAPIView):
    """
    API view to create a Technicien account.
    """
    queryset = Technicien.objects.all()
    serializer_class = TechnicienSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class TechnicienUpdateView(generics.UpdateAPIView):
    """
    API view to update a Technicien account.
    """
    queryset = Technicien.objects.all()
    serializer_class = TechnicienSerializer
    lookup_field = 'id'
    permission_classes = [IsTechnician | IsAdmin, IsAuthenticated]


# Personnel Views
class PersonnelListView(generics.ListAPIView):
    """
    API view to list all Personnel accounts with filtering options.
    """
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class PersonnelDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a Personnel account by its ID.
    """
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer
    lookup_field = 'id'
    permission_classes = [IsPersonnel | IsAdmin, IsAuthenticated]


class PersonnelCreateView(generics.CreateAPIView):
    """
    API view to create a Personnel account.
    """
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class PersonnelUpdateView(generics.UpdateAPIView):
    """
    API view to update a Personnel account.
    """
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer
    lookup_field = 'id'
    permission_classes = [IsPersonnel | IsAdmin, IsAuthenticated]


# Poste Views
class PosteCreateView(generics.CreateAPIView):
    """
    API view to create a new Poste.
    """
    queryset = Poste.objects.all()
    serializer_class = PosteSerializer
    permission_classes = [IsAdmin, IsAuthenticated]
