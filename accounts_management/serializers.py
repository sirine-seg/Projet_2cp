from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'numero_tel', 'photo']
        read_only_fields = ['id', 'role']

class TechnicienCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'numero_tel', 'photo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            numero_tel=validated_data['numero_tel'],
            photo=validated_data['photo'],
            role=User.TECHNICIEN
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class PersonnelCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'numero_tel', 'photo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            numero_tel=validated_data['numero_tel'],
            photo=validated_data['photo'],
            role=User.PERSONNEL
        )
        user.set_password(validated_data['password'])
        user.save()
        return user