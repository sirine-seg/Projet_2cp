''''
* this page contains two main classes :
    - CustomTokenObtainPairSerializer : 
        * this class inherits from the TokenObtainPairSerializer class 
        * it ovverides the get_token method to add custom claims to the token
    - UserSerializer : 
        * this class inherits from the ModelSerializer class 
        * it defines the fields that will be serialized and sent to the client
'''


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from gestion.models import User


# this clas inherits from the TokenObtainPairSerializer class 
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    '''
    ovveride the get_token method to add custom claims to the token
    '''

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Ajoutez des claims personnalisés
        token['email'] = user.email
        token['role'] = user.role
        token['id'] = user.id
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom response data
        data['role'] = self.user.role
        data['id'] = self.user.id
        
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password', 'role', 'first_name', 'last_name', 'numero_tel')
        extra_kwargs = {'password': {'write_only': True}}