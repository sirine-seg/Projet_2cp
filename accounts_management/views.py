from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Admin, Technicien, Personnel, User, Poste
from .serializers import AdminSerializer, TechnicienSerializer, PersonnelSerializer, UserSerializer, PosteSerializer , AdminCreationSerializer , PersonnelCreationSerializer , TechnicienCreationSerializer,TechnicienUpdateSerializer
from .filters import UserFilter, TechnicienFilter
from accounts_management.permissions import IsAdmin, IsTechnician, IsPersonnel
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response



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


#class AdminCreateView(generics.CreateAPIView):
#    """
#    API view to create an Admin account.
#    """
#    queryset = Admin.objects.all()
#    serializer_class = AdminSerializer
#    permission_classes = [IsAdmin, IsAuthenticated]

class UserUpdateView(generics.UpdateAPIView):
    """
    API view to update any User account.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    permission_classes = [IsAdmin, IsAuthenticated]

  #  def perform_update(self, serializer):
      #  """
       # Override perform_update to handle role changes.
     #   """
     #   user = serializer.save()
      #  print(f"Updated user role: {user.role}")  # Debugging
     #   if user.role == "Administrateur" and not Admin.objects.filter(user=user).exists():
       #     Personnel.objects.filter(user=user).delete()
       #     Admin.objects.create(user=user)
      #  elif user.role == "Personnel" and not Personnel.objects.filter(user=user).exists():
      #      Admin.objects.filter(user=user).delete()
      #      Personnel.objects.create(user=user)



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


#class TechnicienCreateView(generics.CreateAPIView):
#    """
#    API view to create a Technicien account.
#    """
#    queryset = Technicien.objects.all()
#    serializer_class = TechnicienSerializer
#    permission_classes = [IsAdmin, IsAuthenticated]

class TechnicienUpdateView(generics.UpdateAPIView):
    """
    API view to update a Technicien account.
    """
    queryset = Technicien.objects.all()
    serializer_class = TechnicienUpdateSerializer
   # lookup_field = 'id'
    lookup_field = 'user_id'
    lookup_url_kwarg ='id'
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


#class PersonnelCreateView(generics.CreateAPIView):
#    """
#    API view to create a Personnel account.
#    """
#    queryset = Personnel.objects.all()
#    serializer_class = PersonnelSerializer
#    permission_classes = [IsAdmin, IsAuthenticated]




# Poste Views
class PosteCreateView(generics.CreateAPIView):
    """
    API view to create a new Poste.
    """
    queryset = Poste.objects.all()
    serializer_class = PosteSerializer
    permission_classes = [IsAdmin, IsAuthenticated]


class UserCreationAPIView (generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny] # This allows any user, authenticated or not
    def get_serializer_class(self):
        role = self.request.data.get("role")
        if role == "Technicien": return TechnicienCreationSerializer
        elif role == "Personnel": return PersonnelCreationSerializer
        else: return AdminCreationSerializer

  
# this view is used to block or unblock the user
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


# the view to retrieve user information
#class UserProfileAPIView(RetrieveUpdateAPIView):
 #   """
 #   GET  -> return the current user's profile
 #   PATCH -> update one or more fields (e.g. first_name, phone_number, etc)
 #   """
 #   serializer_class = UserProfileSerializer
 #   permission_classes = [IsAuthenticated]

 #   def get_object(self):
        # just return the User instance of the logged-in user
 #       return self.request.user

class MeAPIView (generics.RetrieveAPIView):
    queryset = User.objects.all()

    def get_serializer_class(self):
        role = self.request.data.get("role")
        if   role == "Technician": return AdminSerializer
        elif role == "Personnel":  return PersonnelSerializer
        else:                      return AdminSerializer

    def get_object(self):
        user = self.request.user
        # If they’re in the Admin role, return the Admin record
        if user.role == User.TECHNICIEN:
            return Technicien.objects.filter (user = user).first ()      # ← your related_name on the OneToOneField
        elif user.role == User.PERSONNEL:
            return Personnel.objects.filter (user=  user).first ()  # ← likewise
        return Admin.objects.filter (user = user).first ()  # ← likewise
    




class PosteListView(generics.ListAPIView):
    """
  API view to list all Poste objects.
    """
    queryset = Poste.objects.all()
    serializer_class = PosteSerializer
    permission_classes = [IsAdmin, IsAuthenticated]