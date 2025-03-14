from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),  # Include the auth_app URLs
    path('api/interventions/', include('intervention.urls')),  # Include the intervention URLs
    path('api/equipements/', include('equipements.urls')),  # Include the equipements URLs
    # ... other URL patterns ...
]