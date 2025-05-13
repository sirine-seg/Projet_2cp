from rest_framework import serializers
from .models import Intervention, InterventionPreventive, InterventionCurrative, StatusIntervention


class InterventionSerializer(serializers.ModelSerializer):
    type_intervention_display = serializers.SerializerMethodField()
    statut_display = serializers.SerializerMethodField()
    urgence_display = serializers.SerializerMethodField()
    technicien_name = serializers.SerializerMethodField()
    technicien_email = serializers.SerializerMethodField()
    admin_name = serializers.SerializerMethodField()
    admin_email = serializers.SerializerMethodField()
    equipement_name = serializers.SerializerMethodField()

    class Meta:
        model = Intervention
        fields = [
            'id', 'type_intervention', 'type_intervention_display', 'title', 'equipement', 'equipement_name',
            'technicien', 'technicien_name', 'technicien_email', 'admin', 'admin_name', 'admin_email', 'urgence', 'urgence_display', 'date_debut', 'statut',
            'statut_display', 'description', 'notes'
        ]
        if Intervention.type_intervention == 'preventive':
            fields.append('period')
        if Intervention.type_intervention == 'currative':
            fields.append('date_fin')
            user_name = serializers.SerializerMethodField()
            fields.append('user')
            fields.append('user_name')

    def get_type_intervention_display(self, obj):
        return obj.get_type_intervention_display() if hasattr(obj, 'get_type_intervention_display') else None

    def get_statut_display(self, obj):
        return obj.statut.name if obj.statut else None

    def get_urgence_display(self, obj):
        return obj.get_urgence_display() if hasattr(obj, 'get_urgence_display') else None

    def get_technicien_name(self, obj):
        if obj.technicien.exists():
            return [
                f"{technicien.user.first_name} {technicien.user.last_name}".strip()
                for technicien in obj.technicien.all()
            ]
        return None

    def get_technicien_email(self, obj):
        if obj.technicien.exists():
            return [
                technicien.user.email.strip()
                for technicien in obj.technicien.all()
            ]
        return None

    def get_admin_name(self, obj):
        return f"{obj.admin.user.first_name} {obj.admin.user.last_name}".strip() if obj.admin else None

    def get_admin_email(self, obj):
        return obj.admin.user.email.strip() if obj.admin else None

    def get_equipement_name(self, obj):
        return obj.equipement.nom if obj.equipement else None


class InterventionPreventiveSerializer(serializers.ModelSerializer):
    type_intervention_display = serializers.SerializerMethodField()
    statut_display = serializers.SerializerMethodField()
    urgence_display = serializers.SerializerMethodField()
    technicien_name = serializers.SerializerMethodField()
    technicien_email = serializers.SerializerMethodField()
    admin_name = serializers.SerializerMethodField()
    admin_email = serializers.SerializerMethodField()
    equipement_name = serializers.SerializerMethodField()

    class Meta:
        model = InterventionPreventive
        fields = [
            'id', 'type_intervention', 'type_intervention_display', 'title', 'equipement', 'equipement_name',
            'technicien', 'technicien_name', 'technicien_email', 'admin', 'admin_name', 'admin_email', 'urgence', 'urgence_display', 'date_debut', 'statut',
            'statut_display', 'description', 'notes', 'period'
        ]

    def get_type_intervention_display(self, obj):
        return obj.get_type_intervention_display() if hasattr(obj, 'get_type_intervention_display') else None

    def get_statut_display(self, obj):
        return obj.statut.name if obj.statut else None

    def get_urgence_display(self, obj):
        return obj.get_urgence_display() if hasattr(obj, 'get_urgence_display') else None

    def get_technicien_name(self, obj):
        if obj.technicien.exists():
            return [
                f"{technicien.user.first_name} {technicien.user.last_name}".strip()
                for technicien in obj.technicien.all()
            ]
        return None

    def get_technicien_email(self, obj):
        if obj.technicien.exists():
            return [
                technicien.user.email.strip()
                for technicien in obj.technicien.all()
            ]
        return None

    def get_admin_name(self, obj):
        return f"{obj.admin.user.first_name} {obj.admin.user.last_name}".strip() if obj.admin else None

    def get_admin_email(self, obj):
        return obj.admin.user.email.strip() if obj.admin else None

    def get_equipement_name(self, obj):
        return obj.equipement.nom if obj.equipement else None


class InterventionCurrativeSerializer(serializers.ModelSerializer):
    type_intervention_display = serializers.SerializerMethodField()
    statut_display = serializers.SerializerMethodField()
    urgence_display = serializers.SerializerMethodField()
    technicien_name = serializers.SerializerMethodField()
    technicien_email = serializers.SerializerMethodField()
    admin_name = serializers.SerializerMethodField()
    admin_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    equipement_name = serializers.SerializerMethodField()

    class Meta:
        model = InterventionCurrative
        fields = [
            'id', 'type_intervention', 'type_intervention_display', 'title', 'equipement', 'equipement_name',
            'technicien', 'technicien_name', 'technicien_email', 'admin', 'admin_name', 'admin_email', 'urgence', 'urgence_display', 'date_debut', 'statut',
            'statut_display', 'description', 'notes', 'user', 'user_name', 'user_email', 'date_fin'
        ]

    def get_type_intervention_display(self, obj):
        return obj.get_type_intervention_display() if hasattr(obj, 'get_type_intervention_display') else None

    def get_statut_display(self, obj):
        return obj.statut.name if obj.statut else None

    def get_urgence_display(self, obj):
        return obj.get_urgence_display() if hasattr(obj, 'get_urgence_display') else None

    def get_technicien_name(self, obj):
        if obj.technicien.exists():
            return [
                f"{technicien.user.first_name} {technicien.user.last_name}".strip()
                for technicien in obj.technicien.all()
            ]
        return None

    def get_technicien_email(self, obj):
        if obj.technicien.exists():
            return [
                technicien.user.email.strip()
                for technicien in obj.technicien.all()
            ]
        return None

    def get_admin_name(self, obj):
        return f"{obj.admin.user.first_name} {obj.admin.user.last_name}".strip() if obj.admin else None

    def get_admin_email(self, obj):
        return obj.admin.user.email.strip() if obj.admin else None

    def get_user_name(self, obj):
        return f"{obj.user.user.first_name} {obj.user.user.last_name}".strip() if obj.user else None

    def get_user_email(self, obj):
        return obj.user.user.email.strip() if obj.user else None

    def get_equipement_name(self, obj):
        return obj.equipement.nom if obj.equipement else None


class StatusInterventionSerializer(serializers.ModelSerializer):
    """
    Serializer for the StatusIntervention model.
    """
    class Meta:
        model = StatusIntervention
        fields = ['id', 'name']

    def get_status_name(self, obj):
        return obj.name if obj else None