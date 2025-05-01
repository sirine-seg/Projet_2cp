from rest_framework import serializers
from .models import User, Admin, Technicien, Personnel, Poste
from django.db import transaction


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
        user_data['role'] = 'Admin'  # Explicitly set the role to 'Admin'

        # Create the user and hash the password
        password = user_data.pop('password', None)
        user = User.objects.create(**user_data)
        if password:
            user.set_password(password)  # Hash the password
            user.save()

        # Create the admin
        return Admin.objects.create(user=user)


class TechnicienSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    poste = serializers.PrimaryKeyRelatedField(
        queryset=Poste.objects.all(), required=False)

    class Meta:
        model = Technicien
        fields = ['user', 'disponibilite', 'poste']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        poste = validated_data.pop('poste', None)

        # Explicitly set the role to 'Technicien'
        user_data['role'] = 'Technicien'

        # Create the user and hash the password
        password = user_data.pop('password', None)
        user = User.objects.create(**user_data)
        if password:
            user.set_password(password)  # Hash the password
            user.save()

        # Create the technicien
        return Technicien.objects.create(user=user, poste=poste, **validated_data)


class PersonnelSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Personnel
        fields = ['user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        # Create the user and hash the password
        password = user_data.pop('password', None)
        user = User.objects.create(**user_data)
        if password:
            user.set_password(password)  # Hash the password
            user.save()

        # Create the personnel
        return Personnel.objects.create(user=user)


### seriializers for the creation of a new user


class TechnicienCreationSerializer(serializers.ModelSerializer):
    poste = serializers.PrimaryKeyRelatedField(
        queryset=Poste.objects.all(), required=False)
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,  # or True if you want to accept "" explicitly
        help_text="Optional: if provided, will be set as the user’s password"
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'numero_tel', 'poste', 'password'
        ]

    def create(self, validated_data):
        # Pull off our extra bits
        poste = validated_data.pop('poste', None)
        pwd = validated_data.pop('password', None)

        with transaction.atomic():
            user = User.objects.create_user(
                password=pwd,
                role=User.TECHNICIEN,
                **validated_data
            )
            Technicien.objects.create(user=user, poste=poste)

        return user

# the serializer for creating a new Admin
class AdminCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,  # or True if you want to accept "" explicitly
        help_text="Optional: if provided, will be set as the user’s password"
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'numero_tel', 'password',
        ]

    def create(self, validated_data):
        # Pull off our extra bits

        pwd = validated_data.pop('password', None)

        with transaction.atomic():
            user = User.objects.create_user(
                password=pwd,
                role=User.ADMIN,
                **validated_data
            )
            Admin.objects.create(user=user)

        return user


# the serilizer for creating a new Personnel  :
class PersonnelCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,  # or True if you want to accept "" explicitly
        help_text="Optional: if provided, will be set as the user’s password"
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'numero_tel', 'password'
        ]

    def create(self, validated_data):
        # Pull off our extra bits

        pwd = validated_data.pop('password', None)

        with transaction.atomic():
            user = User.objects.create_user(
                password=pwd,
                role=User.PERSONNEL,
                **validated_data
            )
            Personnel.objects.create(user=user)

        return user

