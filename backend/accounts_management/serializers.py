from rest_framework import serializers
from .models import User, Admin, Technicien, Personnel, Poste


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'numero_tel',
            'photo', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class PosteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Poste model.
    """
    class Meta:
        model = Poste
        fields = ['id', 'nom']


class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ['user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        return Admin.objects.create(user=user)


class TechnicienSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    poste = PosteSerializer()

    class Meta:
        model = Technicien
        fields = ['user', 'disponibilite', 'poste']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        poste_data = validated_data.pop('poste', None)

        user = User.objects.create(**user_data)

        poste = None
        if poste_data:
            poste, _ = Poste.objects.get_or_create(**poste_data)

        return Technicien.objects.create(user=user, poste=poste, **validated_data)


class PersonnelSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Personnel
        fields = ['user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        return Personnel.objects.create(user=user)
