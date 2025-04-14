"""
URL configuration for emchi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from accounts_management import views as accounts_views
from rest_framework.authtoken.views import obtain_auth_token
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path ('users/', include('accounts_management.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('login_success/', accounts_views.login_success, name='login_success'),
    path('accounts_management/', include('accounts_management.urls')),
    path('equipements/', include('equipements_management.urls')),
    path('intervention/', include('intervention_management.urls')),
     path('api/token/', obtain_auth_token, name='api_token_auth'),
   
] 

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)