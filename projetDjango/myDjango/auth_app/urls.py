from django.urls import path
from .views import CustomTokenObtainPairView, RegisterView , LogoutView


#internal urls for the auth_app
urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
