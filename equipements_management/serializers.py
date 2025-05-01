from rest_framework import serializers
from .models import EtatEquipement, CategorieEquipement, TypeEquipement, LocalisationEquipement, Equipement


class EtatEquipementSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtatEquipement
        fields = ['id', 'nom']

    def get_etat_nom(self, obj):
        return obj.nom if hasattr(obj, 'nom') else None


class CategorieEquipementSerializer(serializers.ModelSerializer):

    class Meta:
        model = CategorieEquipement
        fields = ['id', 'nom']

    def get_categorie_nom(self, obj):
        return obj.nom if hasattr(obj, 'nom') else None


class TypeEquipementSerializer(serializers.ModelSerializer):

    categorie_display = serializers.SerializerMethodField()

    class Meta:
        model = TypeEquipement
        fields = ['id', 'nom', 'categorie', 'categorie_display']

    def validate_categorie(self, value):
        if not value:
            raise serializers.ValidationError("La catégorie est requise.")
        return value

    def get_categorie_display(self, obj):
        return obj.categorie.nom if obj.categorie else None

    def get_type_nom(self, obj):
        return obj.nom if hasattr(obj, 'nom') else None


class LocalisationEquipementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalisationEquipement
        fields = ['id', 'nom']

    def get_localisation_nom(self, obj):
        return obj.nom if hasattr(obj, 'nom') else None


class EquipementSerializer(serializers.ModelSerializer):

    etat_nom = serializers.SerializerMethodField()
    categorie_nom = serializers.SerializerMethodField()
    typee_nom = serializers.SerializerMethodField()
    localisation_nom = serializers.SerializerMethodField()

    class Meta:
        model = Equipement
        fields = [
            'id_equipement', 'code', 'nom', 'categorie', 'categorie_nom',  'typee', 'typee_nom',  'localisation',
            'localisation_nom', 'date_ajout', 'etat', 'etat_nom', 'manuel', 'image'
        ]

    def get_etat_nom(self, obj):
        return obj.etat.nom if obj.etat else None

    def get_categorie_nom(self, obj):
        return obj.categorie.nom if obj.categorie else None

    def get_typee_nom(self, obj):
        return obj.typee.nom if obj.typee else None

    def get_localisation_nom(self, obj):
        return obj.localisation.nom if obj.localisation else None