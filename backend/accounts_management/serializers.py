from rest_framework import serializers
from .models import User, Technicien, Personnel, Admin


class UserSerializer(serializers.ModelSerializer):
    technicien = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name',
                  'role', 'numero_tel', 'photo', 'technicien']
        read_only_fields = ['id']

    def get_technicien(self, obj):
        try:
            technicien = obj.technicien
            return {
                'disponibilite': technicien.disponibilite,
                'poste': technicien.poste
            }
        except Technicien.DoesNotExist:
            return None


class TechnicienCreationSerializer(serializers.ModelSerializer):
    poste = serializers.CharField(required=False, allow_blank=True)
    use_password = serializers.BooleanField(default=False, write_only=True)
    password = serializers.CharField(
        write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name',
                  'password', 'numero_tel', 'poste', 'use_password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        poste = validated_data.pop('poste', '')
        use_password = validated_data.pop('use_password', False)
        password = validated_data.pop('password', None)

        user = User(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            numero_tel=validated_data.get('numero_tel'),
            role=User.TECHNICIEN
        )

        if use_password and password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()

        return user


class PersonnelCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name',
                  'password', 'numero_tel', 'photo', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            numero_tel=validated_data.get('numero_tel'),
            photo=validated_data.get('photo'),
            role=validated_data.get('role', User.PERSONNEL)
        )
        user.set_password(validated_data['password'])
        user.save()

        Personnel.objects.create(user=user)

        return user


class TechnicienSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Technicien
        fields = ['user', 'disponibilite', 'poste']


class PersonnelSerializer(serializers.ModelSerializer):
    """Serializer for displaying Personnel information in nested responses"""
    user = UserSerializer()

    class Meta:
        model = Personnel
        fields = ['user']


class AdminSerializer(serializers.ModelSerializer):
    """Serializer for displaying Admin information in nested responses"""
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ['user']
