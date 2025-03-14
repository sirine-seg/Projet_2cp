from rest_framework import serializers
from intervention_management.models import InterventionRecord , Intervention
from accounts_management.models import  Technicien
from equipements_management.models import Equipement


class InterventionRecordSerializer(serializers.ModelSerializer):
    # Add useful read-only fields that can be displayed in the API response
    equipement_nom = serializers.ReadOnlyField(source='intervention.id_equipement.nom')
    equipement_id = serializers.ReadOnlyField(source='intervention.id_equipement.id_equipement')
    technicien_nom = serializers.ReadOnlyField(source='intervention.id_technicien.user.get_full_name')
    date_intervention = serializers.ReadOnlyField(source='intervention.date_debut')
    statut_intervention = serializers.ReadOnlyField(source='intervention.statut')
    
    class Meta:
        model = InterventionRecord
        fields = [
            'id', 
            'intervention', 
            'actions_effectuees', 
            'pieces_remplacees', 
            'type_maintenance',
            # Read-only convenience fields
            'equipement_nom',
            'equipement_id',
            'technicien_nom',
            'date_intervention',
            'statut_intervention'
        ]
        read_only_fields = ['id']