from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Admin, Technicien, Personnel, User
from .serializers import AdminSerializer, TechnicienSerializer, PersonnelSerializer, UserSerializer
from .filters import UserFilter, AdminFilter, TechnicienFilter, PersonnelFilter
from accounts_management.permissions import IsAdmin


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


class AdminListView(generics.ListAPIView):
    """
    API view to list all Admin accounts with filtering options.
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = AdminFilter
    permission_classes = [IsAdmin, IsAuthenticated]


class AdminDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve an Admin account by its ID.
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]


class AdminCreateView(APIView):
    """
    API view to create an Admin account.
    """
    permission_classes = [IsAdmin, IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    permission_classes = [IsAdmin, IsAuthenticated]


class TechnicienCreateView(APIView):
    """
    API view to create a Technicien account.
    """
    permission_classes = [IsAdmin, IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = TechnicienSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PersonnelListView(generics.ListAPIView):
    """
    API view to list all Personnel accounts with filtering options.
    """
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PersonnelFilter
    permission_classes = [IsAdmin, IsAuthenticated]


class PersonnelDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a Personnel account by its ID.
    """
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]


class PersonnelCreateView(APIView):
    """
    API view to create a Personnel account.
    """
    permission_classes = [IsAdmin, IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PersonnelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
