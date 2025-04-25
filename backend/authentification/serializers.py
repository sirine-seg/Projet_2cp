from rest_framework import serializers
from accounts_management.models import User, Personnel
from rest_framework_simplejwt.tokens import RefreshToken


class UserRegisterSerializer (serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'numero_tel']

    def create(self, validated_data):
        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            numero_tel=validated_data['numero_tel']
        )
        user.set_password(validated_data['password'])
        user.save()

        personnel = Personnel(user=user,)
        personnel.save()

        return user
