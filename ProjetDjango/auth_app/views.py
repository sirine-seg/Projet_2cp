from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomTokenObtainPairSerializer, UserSerializer
from gestion.models import User, Admin, Technicien, Personnel
from rest_framework.permissions import IsAuthenticated

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
                role=serializer.validated_data['role'],
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name'],
                numero_tel=serializer.validated_data.get('numero_tel')
            )
            
            # Debugging: Print the user's role
            print(f"User role: {user.role}")
            
            # Création du profil spécifique selon le rôle
            # the prints are debugging stuffs
            if user.role == User.ADMIN:
                #print("Creating Admin profile")
                Admin.objects.create(user=user)
            elif user.role == User.TECHNICIEN:
                #print("Creating Technicien profile")
                Technicien.objects.create(user=user)
            elif user.role == User.PERSONNEL:
                #print("Creating Personnel profile")
                Personnel.objects.create(user=user)
            
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'email': request.user.email,
            'role': request.user.role,
            'message': 'Authenticated!'
        })




class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)