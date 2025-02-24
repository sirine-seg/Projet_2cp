from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipementViewSet

router = DefaultRouter() # Cree url par default  ;est un outil fourni par Django REST Framework qui génère automatiquement des routes API en fonction du ViewSet fourni.
router.register(r'equipements', EquipementViewSet)  # # Enregistrement du ViewSet sous le chemin "equipements/"

urlpatterns = [
    path('', include(router.urls)),
]
