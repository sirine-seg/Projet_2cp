from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Admin, Technicien, Personnel, User, Poste
from .serializers import AdminSerializer, TechnicienSerializer, PersonnelSerializer, UserSerializer, PosteSerializer, AdminCreationSerializer, PersonnelCreationSerializer, TechnicienCreationSerializer, TechnicienUpdateSerializer
from .filters import UserFilter, TechnicienFilter
from accounts_management.permissions import IsAdmin, IsTechnician, IsPersonnel
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response


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


class UserUpdateView(generics.UpdateAPIView):
    """
    API view to update any User account.
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
    permission_classes = [IsAdmin, IsAuthenticated]


class AdminDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve an Admin account by its ID.
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]


class AdminUpdateView(generics.UpdateAPIView):
    """
    API view to update an Admin account.
    """
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'user_id'
    permission_classes = [IsAdmin, IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        return get_object_or_404(Admin, user_id=user_id)


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


class TechnicienUpdateView(generics.UpdateAPIView):
    """
    API view to update a Technicien account.
    """
    queryset = Technicien.objects.all()
    serializer_class = TechnicienUpdateSerializer
    lookup_field = 'user_id'
    permission_classes = [IsTechnician | IsAdmin, IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        return get_object_or_404(Technicien, user_id=user_id)


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


class UserCreationAPIView (generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        role = self.request.data.get("role")
        if role == "Technicien":
            return TechnicienCreationSerializer
        elif role == "Personnel":
            return PersonnelCreationSerializer
        else:
            return AdminCreationSerializer


class BlockUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.is_blocked = True
        user.save(update_fields=['is_blocked'])
        return Response({'detail': f'User {user.username} blocked'}, status=status.HTTP_200_OK)


class UnblockUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.is_blocked = False
        user.save(update_fields=['is_blocked'])
        return Response({'detail': f'User {user.username} unblocked'}, status=status.HTTP_200_OK)


class MeAPIView (generics.RetrieveAPIView):
    queryset = User.objects.all()

    def get_serializer_class(self):
        user = self.request.user
        if user.role == User.TECHNICIEN:
            return TechnicienSerializer
        elif user.role == User.PERSONNEL:
            return PersonnelSerializer
        return AdminSerializer

    def get_object(self):
        user = self.request.user
        # If they’re in the Admin role, return the Admin record
        if user.role == User.TECHNICIEN:
            # ← your related_name on the OneToOneField
            return Technicien.objects.filter(user=user).first()
        elif user.role == User.PERSONNEL:
            return Personnel.objects.filter(user=user).first()  # ← likewise
        return Admin.objects.filter(user=user).first()  # ← likewise


class PosteListView(generics.ListAPIView):
    """
    API view to list all Poste objects.
    """
    queryset = Poste.objects.all()
    serializer_class = PosteSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class PosteCreateView(generics.CreateAPIView):
    """
    API view to create a new Poste.
    """
    queryset = Poste.objects.all()
    serializer_class = PosteSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class PosteUpdateView(generics.UpdateAPIView):
    """
    API view to update a Poste.
    """
    queryset = Poste.objects.all()
    serializer_class = PosteSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]


class PosteDeleteView(generics.DestroyAPIView):
    """
    API view to delete a Poste.
    """
    queryset = Poste.objects.all()
    serializer_class = PosteSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]


class ToggleActivateNotificationView(generics.RetrieveAPIView):
    """
    API view to retrieve and toggle the activation status of notifications for a specific user.
    """
    queryset = User.objects.all()
    lookup_field = 'id'
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieve the current notification activation status for a specific user.
        """
        user = self.get_object()
        return Response({'is_notification_active': user.active_notif}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Toggle the activation status of notifications for a specific user.
        """
        user = self.get_object()
        user.toggle_activate_notif()
        user.save()
        return Response({'is_notification_active': user.active_notif}, status=status.HTTP_200_OK)


class ToggleActivateNotificationEmailView(generics.RetrieveAPIView):
    """
    API view to retrieve and toggle the activation status of email notifications for a specific user.
    """
    queryset = User.objects.all()
    lookup_field = 'id'
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieve the current email notification activation status for a specific user.
        """
        user = self.get_object()
        return Response({'is_email_notification_active': user.active_notif_email}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Toggle the activation status of email notifications for a specific user.
        """
        user = self.get_object()
        user.toggle_activate_notif_email()
        user.save()
        return Response({'is_email_notification_active': user.active_notif_email}, status=status.HTTP_200_OK)
