from rest_framework import serializers
from .models import StatusIntervention, InterventionPreventive, InterventionCurrative
from equipements_management.models import Equipement
from accounts_management.models import Technicien


class StatusInterventionSerializer(serializers.ModelSerializer):
    """
    Serializer for the StatusIntervention model.
    """
    class Meta:
        model = StatusIntervention
        fields = '__all__'


class InterventionPreventiveSerializer(serializers.ModelSerializer):
    """
    Serializer for the InterventionPreventive model (Admin only).
    """
    statut = serializers.StringRelatedField(
        read_only=True)  # Display status name
    technicien = serializers.PrimaryKeyRelatedField(
        queryset=Technicien.objects.all(), many=True, required=True)

    class Meta:
        model = InterventionPreventive
        fields = [
            'id_intervention',
            'title',
            'equipement',
            'technicien',
            'admin',
            'urgence',
            'date_debut',
            'statut',
            'blocked',
            'description',
            'notes',
            'period',
        ]

    def create(self, validated_data):
        """
        Automatically assign the logged-in admin to the intervention.
        """
        validated_data['admin'] = self.context['request'].user.admin
        return super().create(validated_data)


class AdminInterventionCurrativeSerializer(serializers.ModelSerializer):
    """
    Serializer for Admin to manage InterventionCurrative.
    """
    equipement = serializers.PrimaryKeyRelatedField(
        queryset=Equipement.objects.all(), required=True)
    technicien = serializers.PrimaryKeyRelatedField(
        queryset=Technicien.objects.all(), many=True, required=True)
    admin = serializers.PrimaryKeyRelatedField(read_only=True)
    statut = StatusInterventionSerializer(read_only=True)

    class Meta:
        model = InterventionCurrative
        fields = [
            'id_intervention', 'title', 'equipement', 'technicien', 'admin',
            'urgence', 'date_debut', 'statut', 'blocked', 'description', 'notes', 'date_fin'
        ]

    def create(self, validated_data):
        """
        Automatically assign the logged-in admin to the intervention.
        """
        validated_data['admin'] = self.context['request'].user.admin
        return super().create(validated_data)


class UserInterventionCurrativeSerializer(serializers.ModelSerializer):
    """
    Serializer for Personnel to create InterventionCurrative.
    """
    equipement = serializers.PrimaryKeyRelatedField(
        queryset=Equipement.objects.all(), required=True)

    class Meta:
        model = InterventionCurrative
        fields = ['id_intervention', 'equipement']

    def create(self, validated_data):
        """
        Automatically assign the logged-in user to the intervention.
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AllInterventionsSerializer(serializers.Serializer):
    """
    Serializer for combined interventions data from both models.
    """
    id_intervention = serializers.IntegerField()
    title = serializers.CharField()
    type = serializers.CharField()
    equipement_id = serializers.IntegerField()
    equipement = serializers.CharField()
    technicien = serializers.JSONField(required=False)
    admin_id = serializers.IntegerField(allow_null=True)
    urgence = serializers.IntegerField()
    date_debut = serializers.DateTimeField()
    statut_id = serializers.IntegerField(allow_null=True)
    statut = serializers.CharField()
    blocked = serializers.BooleanField()
    description = serializers.CharField(allow_null=True, allow_blank=True)
    notes = serializers.CharField(allow_null=True, allow_blank=True)
    period = serializers.IntegerField(required=False, allow_null=True)
    user_id = serializers.IntegerField(required=False, allow_null=True)
    date_fin = serializers.DateTimeField(required=False, allow_null=True)
