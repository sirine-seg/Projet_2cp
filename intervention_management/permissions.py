from rest_framework.permissions import BasePermission 
from accounts_management.models import User 
class CanDeclareIntervention (BasePermission) : 
    """
    Custom permission to allow only personnel and technicien to declare an intervention.
    """


    def has_permission (self , request , view) : 
        return request.user and (request.user.role in [User.PERSONNEL , User.TECHNICIEN])