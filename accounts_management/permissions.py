from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'Administrateur'


class IsTechnician(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'technicien')


class IsPersonnel(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'Personnel'


class IsNotBlockedUser(permissions.BasePermission):
    """
    Permission to check if a user is blocked.
    Blocks access to the entire site if user.is_blocked is True.
    """
    message = "Your account has been blocked. Please contact an administrator."

    def has_permission(self, request, view):
        # Allow unauthenticated users to pass (authentication will handle them)
        if not request.user.is_authenticated:
            return True

        # Block access if user is blocked
        return not request.user.is_blocked
