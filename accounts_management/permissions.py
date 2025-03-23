from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow administrators to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'Administrateur' 
    

class IsTechnician(permissions.BasePermission):
    def has_permission (self ,  request , view) : 
        return request.user and request.user.role == 'Technicien'
    
class IsPersonnel (permissions.BasePermission) : 
    def has_permission (self , request , view) : 
        return request.user and request.user.role == 'Personnel'
    


