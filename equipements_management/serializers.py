from rest_framework import serializers
from .models import Equipement, EtatEquipement





class EtatEquipementListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtatEquipement
        fields = ['id', 'nom', 'description']



# Serializer to assign an état to an équipement
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
            raise serializers.ValidationError({"equipement_id": "Équipement non trouvé."})
        return data

    def save(self, **kwargs):
        equipement = self.validated_data['equipement']
        etat_nom = self.validated_data['etat_nom']

        # Get or create EtatEquipement
        etat, _ = EtatEquipement.objects.get_or_create(nom=etat_nom)

        # Assign état to équipement
        equipement.etat = etat
        equipement.save()

        return equipement


# Main serializer for Equipement
from rest_framework import serializers
from .models import Equipement

class EquipementSerializer(serializers.ModelSerializer):
    categorie = serializers.ChoiceField(
        choices=Equipement.CATEGORIE_CHOICES,
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    type = serializers.ChoiceField(  # maps to 'typee' field in the model
        source='typee',
        choices=Equipement.TYPE_CHOICES,
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    localisation = serializers.ChoiceField(
        choices=Equipement.LOCALISATION_CHOICES,
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    custom_localisation = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    image = serializers.ImageField(
        required=False,
        allow_null=True,
        use_url=True,
    )
    statut_label = serializers.SerializerMethodField()

    class Meta:
        model = Equipement
        fields = [
            'id_equipement', 'nom', 'categorie', 'type',
            'localisation', 'custom_localisation', 'date_ajout',
            'manuel', 'etat', 'image', 'statut_label'
        ]
        read_only_fields = ['id_equipement', 'date_ajout']

    def get_statut_label(self, obj):
        return obj.etat.nom if obj.etat else None

    def validate(self, data):
        """
        Ensure custom_localisation is filled if 'OTHER' is selected.
        """
        localisation = data.get('localisation')
        custom_localisation = data.get('custom_localisation')

        if localisation == 'OTHER' and not custom_localisation:
            raise serializers.ValidationError({
                'custom_localisation': "Veuillez remplir le champ de localisation personnalisée si 'Autre' est sélectionné."
            })
        return data
