from rest_framework import serializers
from .models import Equipement, EtatEquipement

class EtatEquipementSerializer(serializers.Serializer):
    equipement_id = serializers.IntegerField()
    etat_nom = serializers.CharField(max_length=255)

    def validate(self, data):
        """
        Ensure the given `equipement_id` exists.
        """
        try:
            data['equipement'] = Equipement.objects.get(id_equipement=data['equipement_id'])
        except Equipement.DoesNotExist:
            raise serializers.ValidationError({"equipement_id": "Equipement not found."})

        return data

    def save(self, **kwargs):
        equipement = self.validated_data['equipement']
        etat_nom = self.validated_data['etat_nom']

        # Try to get an existing etat or create a new one
        etat, _ = EtatEquipement.objects.get_or_create(nom=etat_nom)

        # Assign etat to equipement
        equipement.etat = etat
        equipement.save()

        return equipement
    




class EquipementSerializer(serializers.ModelSerializer):
    # Use a custom field for equipment state that handles both reading and writing
    category = serializers.ChoiceField (source='categorie', allow_null=True, allow_blank=True, required=False , choices = Equipement.CATEGORIE_CHOICES)
    type_    = serializers.ChoiceField (source='typee', allow_null=True, allow_blank=True, required=False , choices = Equipement.TYPE_CHOICES) 
    # localistion 
    localisation = serializers.ChoiceField(
        choices=Equipement.LOCALISATION_CHOICES, 
        required=False
    )
    custom_localisation = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    image = serializers.ImageField(max_length=None, use_url=True, required=False , allow_null=True) 



    class Meta:
        model = Equipement
        fields = ['id_equipement' ,'nom', 'category', 'type_', 'localisation', 'custom_localisation'  , 
                 'date_ajout', 'manuel' , 'etat' , 'image']
        read_only_fields = ['date_ajout' , 'id_equipement']


    def validate(self, data):
        """
        Ensures if 'Other' is selected, custom_localisation must be filled.
        """
        if data.get('localisation') == 'OTHER' and not data.get('custom_localisation'):
            raise serializers.ValidationError("You must specify a custom localisation if 'Other' is selected.")
        return data
