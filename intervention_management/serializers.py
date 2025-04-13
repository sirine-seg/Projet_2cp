from rest_framework import serializers
from .models import Intervention, Status, Equipement, Technicien, Personnel, Admin 
from accounts_management.models import User 
from accounts_management import serializers as account_serializers

# serializer for status 
class StatusSerializer (serializers.ModelSerializer) : 
    class Meta : 
        model  = Status 
        fields  = ['id' , 'name']
        # the id is just to make the status easy to handle 


class AdminInterventionSerializer(serializers.ModelSerializer):
    # Primary Key Related Fields (Only IDs for Foreign Keys)
    equipement = serializers.PrimaryKeyRelatedField(queryset=Equipement.objects.all(), required=True)
    technicien = serializers.PrimaryKeyRelatedField(queryset=Technicien.objects.all(), required=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    # Allow admin to be writable
    admin = serializers.PrimaryKeyRelatedField(queryset=Admin.objects.all(), required=False, allow_null=True)

    description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    notes = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    statut = StatusSerializer(read_only=True)

    class Meta:
        model = Intervention
        fields = [
            'id', 'equipement', 'technicien', 'admin',
            'urgence', 'date_debut', 'date_fin', 'statut', 'description', 'notes', 'user'
        ]

    def create(self, validated_data):
        # Automatically assign the logged-in admin if not provided
        if 'admin' not in validated_data or validated_data['admin'] is None:
            validated_data['admin'] = self.context['request'].user.admin
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Automatically assign the logged-in admin if not provided
        if 'admin' not in validated_data or validated_data['admin'] is None:
            validated_data['admin'] = self.context['request'].user.admin
        return super().update(instance, validated_data)


class InterventionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intervention
        fields = '__all__'
        extra_kwargs = {field: {'required': False} for field in fields}


class UserInterventionSerializer(serializers.ModelSerializer):
    equipement = serializers.PrimaryKeyRelatedField(queryset=Equipement.objects.all() , required  = True)
    description = serializers.CharField(required=False, allow_null=True  ,allow_blank = True) 
    class Meta  : 
        model = Intervention 
        fields  = ['id' ,  'user' , 'equipement'  , 'description'] 

    def create (self  , validated_data)  : 
        validated_data ['user'] = self.context ['request'].user 
        return super().create(validated_data)


