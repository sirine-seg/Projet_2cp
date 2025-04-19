from rest_framework import serializers
from .models import StatusIntervention, InterventionPreventive, InterventionCurrative


class StatusInterventionSerializer(serializers.ModelSerializer):
    """Serializer for the StatusIntervention model."""

    class Meta:
        model = StatusIntervention
        fields = ['id', 'name']


class InterventionPreventiveSerializer(serializers.ModelSerializer):
    """Serializer for the InterventionPreventive model."""

    class Meta:
        model = InterventionPreventive
        fields = [
            'id', 'type_intervention', 'title', 'equipement', 'technicien',
            'admin', 'urgence', 'date_debut', 'statut', 'blocked',
            'description', 'notes', 'period'
        ]


class InterventionPreventiveUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating InterventionPreventive models."""

    class Meta:
        model = InterventionPreventive
        fields = [
            'id', 'type_intervention', 'title', 'equipement', 'technicien',
            'admin', 'urgence', 'date_debut', 'statut', 'blocked',
            'description', 'notes', 'period'
        ]
        read_only_fields = ['id']  # Prevent updating the ID


class AdminInterventionCurrativeSerializer(serializers.ModelSerializer):
    """Serializer for the InterventionCurrative model."""

    class Meta:
        model = InterventionCurrative
        fields = [
            'id', 'type_intervention', 'title', 'equipement', 'technicien',
            'admin', 'urgence', 'date_debut', 'statut', 'blocked',
            'description', 'notes', 'user', 'date_fin'
        ]


class PersonnelInterventionCurrativeSerializer(serializers.ModelSerializer):
    """Serializer for the InterventionCurrative model for personnel."""

    class Meta:
        model = InterventionCurrative
        fields = ['id', 'equipement', 'user', 'description']


class InterventionCurrativeUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating all fields of the InterventionCurrative model."""

    class Meta:
        model = InterventionCurrative
        fields = [
            'id', 'type_intervention', 'title', 'equipement', 'technicien',
            'admin', 'urgence', 'date_debut', 'statut', 'blocked',
            'description', 'notes', 'user', 'date_fin'
        ]
        read_only_fields = ['id']  # Prevent updating the ID

    def validate(self, data):
        if data.get('date_fin') and data.get('date_debut') and data['date_fin'] < data['date_debut']:
            raise serializers.ValidationError(
                "The end date must be after the start date.")
        return data
