from rest_framework import serializers
from .models import EtatEquipement, CategorieEquipement, TypeEquipement, LocalisationEquipement, Equipement


class EtatEquipementSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtatEquipement
        fields = '__all__'


class CategorieEquipementSerializer(serializers.ModelSerializer):
    types = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = CategorieEquipement
        fields = '__all__'


class TypeEquipementSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeEquipement
        fields = ['id', 'nom', 'categorie']

    def validate_categorie(self, value):
        if not value:
            raise serializers.ValidationError("La catégorie est requise.")
        return value


class LocalisationEquipementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalisationEquipement
        fields = '__all__'


class EquipementSerializer(serializers.ModelSerializer):
    categorie = serializers.PrimaryKeyRelatedField(
        queryset=CategorieEquipement.objects.all())
    typee = serializers.PrimaryKeyRelatedField(
        queryset=TypeEquipement.objects.all())
    localisation = serializers.PrimaryKeyRelatedField(
        queryset=LocalisationEquipement.objects.all(), required=False)
    etat = serializers.PrimaryKeyRelatedField(
        queryset=EtatEquipement.objects.all(), required=False)

    class Meta:
        model = Equipement
        fields = [
            'id_equipement',
            'nom',
            'categorie',
            'typee',
            'localisation',
            'date_ajout',
            'etat',
            'manuel',
            'image',
        ]
