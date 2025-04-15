from rest_framework import serializers
from accounts_management.models import User 
from rest_framework_simplejwt.tokens import RefreshToken
    


# this is a serializers for the Sign Up . 
class UserRegisterSerializer (serializers.ModelSerializer) : 
    password = serializers.CharField(write_only=True)

    class Meta  : 
        model  = User 
        fields = ['email' , 'first_name' , 'last_name' , 'password' , 'numero_tel']  


    def create (self , validated_data) : 
        user = User (
            first_name  = validated_data ['first_name'] , 
            last_name   = validated_data ['last_name'] , 
            email       = validated_data ['email'] , 
            numero_tel  = validated_data ['numero_tel']
        )
        user.set_password (validated_data['password']) 
        user.save () 

        from accounts_management.models import Personnel  # Import at function level to avoid circular imports
        personnel = Personnel(
        user=user,
        # Add any other required fields for Personnel
        # For example: role='default_role', department='general', etc.
)
        personnel.save()
    
        return user 



    
