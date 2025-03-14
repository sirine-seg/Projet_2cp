from rest_framework import serializers
from gestion.models import Intervention

class InterventionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intervention
        fields = '__all__'  # Or specify the fields explicitly