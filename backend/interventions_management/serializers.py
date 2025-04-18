from rest_framework import serializers
from .models import StatusIntervention, Intervention, InterventionPreventive, InterventionCurrative
from equipements_management.models import Equipement
from accounts_management.models import Technicien
from django.db import transaction


class StatusInterventionSerializer(serializers.ModelSerializer):
    """
    Serializer for the StatusIntervention model.
    """
    class Meta:
        model = StatusIntervention
        fields = '__all__'


class InterventionSerializer(serializers.ModelSerializer):
    """
    Base serializer for the Intervention model.
    """
    statut = serializers.StringRelatedField(read_only=True)
    technicien = serializers.PrimaryKeyRelatedField(
        queryset=Technicien.objects.all(), many=True, required=True)

    class Meta:
        model = Intervention
        fields = [
            'id_intervention', 'type_intervention', 'title', 'equipement',
            'technicien', 'admin', 'urgence', 'date_debut', 'statut',
            'blocked', 'description', 'notes'
        ]


class InterventionPreventiveSerializer(serializers.ModelSerializer):
    """
    Serializer for preventive interventions.
    """
    intervention = InterventionSerializer()

    class Meta:
        model = InterventionPreventive
        fields = ['intervention', 'period']

    @transaction.atomic
    def create(self, validated_data):
        intervention_data = validated_data.pop('intervention')
        techniciens = intervention_data.pop('technicien')

        # Add type and admin automatically
        intervention_data['type_intervention'] = Intervention.TYPE_PREVENTIVE
        intervention_data['admin'] = self.context['request'].user.admin

        # Create the base intervention
        intervention = Intervention.objects.create(**intervention_data)

        # Add technicians
        intervention.technicien.set(techniciens)

        # Create the preventive details
        preventive = InterventionPreventive.objects.create(
            intervention=intervention, **validated_data)

        return preventive

    @transaction.atomic
    def update(self, instance, validated_data):
        intervention_data = validated_data.pop('intervention', {})
        techniciens = intervention_data.pop('technicien', None)

        # Update the base intervention
        for key, value in intervention_data.items():
            setattr(instance.intervention, key, value)

        # Update technicians if provided
        if techniciens is not None:
            instance.intervention.technicien.set(techniciens)

        instance.intervention.save()

        # Update preventive-specific fields
        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        """
        Flatten the nested structure for easier frontend consumption.
        """
        representation = super().to_representation(instance)
        intervention_representation = representation.pop('intervention')
        for key in intervention_representation:
            representation[key] = intervention_representation[key]

        return representation


class AdminInterventionCurrativeSerializer(serializers.ModelSerializer):
    """
    Serializer for Admin to manage InterventionCurrative.
    """
    intervention = InterventionSerializer()

    class Meta:
        model = InterventionCurrative
        fields = ['intervention', 'user', 'date_fin']

    @transaction.atomic
    def create(self, validated_data):
        intervention_data = validated_data.pop('intervention')
        techniciens = intervention_data.pop('technicien')

        # Add type and admin automatically
        intervention_data['type_intervention'] = Intervention.TYPE_CURRATIVE
        intervention_data['admin'] = self.context['request'].user.admin

        # Create the base intervention
        intervention = Intervention.objects.create(**intervention_data)

        # Add technicians
        intervention.technicien.set(techniciens)

        # Create the currative details
        currative = InterventionCurrative.objects.create(
            intervention=intervention, **validated_data)

        return currative

    @transaction.atomic
    def update(self, instance, validated_data):
        intervention_data = validated_data.pop('intervention', {})
        techniciens = intervention_data.pop('technicien', None)

        # Update the base intervention
        for key, value in intervention_data.items():
            setattr(instance.intervention, key, value)

        # Update technicians if provided
        if techniciens is not None:
            instance.intervention.technicien.set(techniciens)

        instance.intervention.save()

        # Update currative-specific fields
        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        """
        Flatten the nested structure for easier frontend consumption.
        """
        representation = super().to_representation(instance)
        intervention_representation = representation.pop('intervention')
        for key in intervention_representation:
            representation[key] = intervention_representation[key]

        return representation


class UserInterventionCurrativeSerializer(serializers.ModelSerializer):
    """
    Serializer for Personnel to create InterventionCurrative.
    """
    intervention = serializers.PrimaryKeyRelatedField(
        queryset=Equipement.objects.all(), write_only=True, source='intervention.equipement')
    title = serializers.CharField(
        source='intervention.title', default="Demande d'intervention")

    class Meta:
        model = InterventionCurrative
        fields = ['intervention', 'title']

    @transaction.atomic
    def create(self, validated_data):
        equipement = validated_data.pop('intervention')['equipement']
        title = validated_data.pop('intervention')['title']

        # Create the base intervention
        intervention = Intervention.objects.create(
            type_intervention=Intervention.TYPE_CURRATIVE,
            title=title,
            equipement=equipement,
        )

        # Create the currative details with the requesting user
        currative = InterventionCurrative.objects.create(
            intervention=intervention,
            user=self.context['request'].user.personnel
        )

        return currative
