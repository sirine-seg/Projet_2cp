from rest_framework import serializers
from gestion.models import Equipement

class EquipementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipement
        fields = '__all__'
