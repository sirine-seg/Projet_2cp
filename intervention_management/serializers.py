from rest_framework import serializers
from .models import Intervention, Status, Equipement, Technicien, Personnel, Admin 
from accounts_management.models import User 
from accounts_management import serializers as account_serializers

# serializer for status 
class StatusSerializer (serializers.ModelSerializer) : 
    class Meta : 
        model  = Status 
        fields  = ['id' , 'name']
        # the id is just to make the status easy to handle 


class AdminInterventionSerializer(serializers.ModelSerializer):
    # Primary Key Related Fields (Only IDs for Foreign Keys)
    equipement = serializers.PrimaryKeyRelatedField(queryset=Equipement.objects.all() , required  = True)
    technicien = serializers.PrimaryKeyRelatedField(queryset=Technicien.objects.all() , required  = True) 
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    # the id of the admin is automatically assigned to the logged in admin  
    admin = serializers.PrimaryKeyRelatedField(read_only=True )
    

    description = serializers.CharField(required=False, allow_null=True , allow_blank = True) 
    notes = serializers.CharField(required=False, allow_null=True , allow_blank = True)
    statut = StatusSerializer(read_only=True)


    class Meta:
        model = Intervention
        fields = [
            'id', 'equipement', 'technicien', 'admin', 
            'urgence', 'date_debut', 'date_fin', 'statut' , 'description', 'notes' , 'user'
        ]    

    def create (self , validated_data) : 
        validated_data ['admin'] = self.context ['request'].user.admin
        return super().create(validated_data)



class InterventionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intervention
        fields = '__all__'
        extra_kwargs = {field: {'required': False} for field in fields}




class UserInterventionSerializer(serializers.ModelSerializer):
    equipement = serializers.PrimaryKeyRelatedField(queryset=Equipement.objects.all() , required  = True)
    description = serializers.CharField(required=False, allow_null=True  ,allow_blank = True) 
    class Meta  : 
        model = Intervention 
        fields  = ['id' ,  'user' , 'equipement'  , 'description'] 

    def create (self  , validated_data)  : 
        validated_data ['user'] = self.context ['request'].user 
        return super().create(validated_data) 


