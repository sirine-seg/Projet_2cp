from rest_framework.permissions import BasePermission
from gestion.models import User

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.ADMIN

class IsTechnicien(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.TECHNICIEN

class IsPersonnel(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.PERSONNEL