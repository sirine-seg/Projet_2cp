from rest_framework import serializers
from .models import Intervention, Status, Equipement, Technicien, Personnel, Admin 

class InterventionSerializer(serializers.ModelSerializer):
    """Serializer for interventions using only IDs, but allowing status creation by name"""

    # Primary Key Related Fields (Only IDs for Foreign Keys)
    id_equipement = serializers.PrimaryKeyRelatedField(queryset=Equipement.objects.all())
    id_technicien = serializers.PrimaryKeyRelatedField(queryset=Technicien.objects.all())
    id_personnel = serializers.PrimaryKeyRelatedField(queryset=Personnel.objects.all(), required=False, allow_null=True)
    id_admin = serializers.PrimaryKeyRelatedField(queryset=Admin.objects.all())
    statut = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all(), required=False, allow_null=True)
    statut_name = serializers.CharField(write_only=True, required=False)  # Allow new status creation
    notes = serializers.CharField(required=False, allow_null=True)


    class Meta:
        model = Intervention
        fields = [
            'id', 'id_equipement', 'id_personnel', 'id_technicien', 'id_admin', 
            'urgence', 'date_debut', 'date_fin', 'statut', 'statut_name', 'description', 'notes'
        ]    

    def validate(self, data):
        """Validate that end date is after start date & handle status creation"""
        # Date validation
        if 'date_debut' in data and 'date_fin' in data:
            if data['date_fin'] < data['date_debut']:
                raise serializers.ValidationError("End date must be after start date")

        return data

    def create(self, validated_data):
        """Create intervention with new or existing status"""
        statut_name = validated_data.pop('statut_name', None)
        statut = validated_data.pop('statut', None)

        # Handle new status creation
        if statut_name:
            statut, created = Status.objects.get_or_create(name="affecté")

        # If no status provided, raise error
        if not statut:
            raise serializers.ValidationError({"statut": "Either 'statut' ID or 'statut_name' must be provided."})

        # Create intervention
        intervention = Intervention.objects.create(**validated_data, statut=statut)
        return intervention

    def update(self, instance, validated_data):
        """Update intervention and handle status creation"""
        statut_name = validated_data.pop('statut_name', None)
        statut = validated_data.pop('statut', None)

        # Handle new status creation
        if statut_name:
            statut, created = Status.objects.get_or_create(name=statut_name)
            instance.statut = statut

        # If existing status is provided, update it
        elif statut:
            instance.statut = statut

        return super().update(instance, validated_data)


