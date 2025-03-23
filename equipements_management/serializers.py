from rest_framework import serializers
from .models import Equipement, EtatEquipement

class EtatEquipementSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtatEquipement
        fields = ['id', 'nom', 'description']
        read_only_fields = ['id']

class EquipementSerializer(serializers.ModelSerializer):
    # Use a custom field for equipment state that handles both reading and writing
    etat = serializers.CharField(source='etat.nom')
    category = serializers.CharField(source='categorie', allow_null=True, allow_blank=True, required=False)
    type_ = serializers.CharField(source='type', allow_null=True, allow_blank=True, required=False)
    # localistion 
    localisation = serializers.ChoiceField(
        choices=Equipement.LOCALISATION_CHOICES, 
        required=False
    )
    custom_localisation = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    def validate(self, data):
        """
        Ensures if 'Other' is selected, custom_localisation must be filled.
        """
        if data.get('localisation') == 'OTHER' and not data.get('custom_localisation'):
            raise serializers.ValidationError("You must specify a custom localisation if 'Other' is selected.")
        return data
    


    
    class Meta:
        model = Equipement
        fields = ['id_equipement' ,'nom', 'category', 'type_', 'localisation', 'custom_localisation'  , 
                 'date_ajout', 'etat', 'manuel']
        read_only_fields = ['date_ajout' , 'id_equipement']
    
    def to_representation(self, instance):
        # Use the parent's to_representation method first
        ret = super().to_representation(instance)
        # Then add the full state object
        ret['etat'] = EtatEquipementSerializer(instance.etat).data
        return ret
    
    def create(self, validated_data):
        # Extract the state name from nested data
        etat_nom = validated_data.pop('etat')['nom']
        # Get or create the state
        etat, _ = EtatEquipement.objects.get_or_create(nom=etat_nom)
        # Create the equipment with the state
        return Equipement.objects.create(etat=etat, **validated_data)
    
    def update(self, instance, validated_data):
        # Handle the state separately if it's included in the update
        if 'etat' in validated_data:
            etat_nom = validated_data.pop('etat')['nom']
            etat, _ = EtatEquipement.objects.get_or_create(nom=etat_nom)
            instance.etat = etat
        
        # Update the other fields
        for key, value in validated_data.items():
            setattr(instance, key, value)
        
        instance.save()
        return instance