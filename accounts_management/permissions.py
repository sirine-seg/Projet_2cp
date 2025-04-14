from rest_framework import permissions
from rest_framework.permissions import BasePermission





class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow administrators to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'Administrateur' 
    

class IsTechnician(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'technicien')
        
class IsPersonnel (permissions.BasePermission) : 
    def has_permission (self , request , view) : 
        return request.user and request.user.role == 'Personnel'
    


