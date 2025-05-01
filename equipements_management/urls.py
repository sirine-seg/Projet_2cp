from django.urls import path
from .views import (
    EquipementListView,
    EquipementDetailView,
    EquipementCreateView,
    EquipementUpdateView,
    EquipementDeleteView,
    EtatEquipementListView,
    EtatEquipementCreateView,
    EtatEquipementUpdateView,
    EtatEquipementDeleteView,
    CategorieEquipementListView,
    CategorieEquipementCreateView,
    CategorieEquipementUpdateView,
    CategorieEquipementDeleteView,
    TypeEquipementListView,
    TypeEquipementCreateView,
    TypeEquipementUpdateView,
    TypeEquipementDeleteView,
    LocalisationEquipementListView,
    LocalisationEquipementCreateView,
    LocalisationEquipementUpdateView,
    LocalisationEquipementDeleteView,
)

urlpatterns = [
    # Equipement URLs
    path('equipement/', EquipementListView.as_view(), name='equipement-list'),
    path('equipement/<int:id_equipement>/', EquipementDetailView.as_view(),
         name='equipement-detail'),
    path('equipement/create/', EquipementCreateView.as_view(),
         name='equipement-create'),
    path('equipement/<int:id_equipement>/update/',
         EquipementUpdateView.as_view(), name='equipement-update'),
    path('equipement/<int:id_equipement>/delete/',
         EquipementDeleteView.as_view(), name='equipement-delete'),

    # EtatEquipement URLs
    path('etat/', EtatEquipementListView.as_view(), name='etat-list'),
    path('etat/create/', EtatEquipementCreateView.as_view(), name='etat-create'),
    path('etat/<int:id>/update/',
         EtatEquipementUpdateView.as_view(), name='etat-update'),
    path('etat/<int:id>/delete/',
         EtatEquipementDeleteView.as_view(), name='etat-delete'),

    # CategorieEquipement URLs
    path('categorie/', CategorieEquipementListView.as_view(), name='categorie-list'),
    path('categorie/create/', CategorieEquipementCreateView.as_view(),
         name='categorie-create'),
    path('categorie/<int:id>/update/',
         CategorieEquipementUpdateView.as_view(), name='categorie-update'),
    path('categorie/<int:id>/delete/',
         CategorieEquipementDeleteView.as_view(), name='categorie-delete'),

    # TypeEquipement URLs
    path('type/', TypeEquipementListView.as_view(), name='type-list'),
    path('type/create/', TypeEquipementCreateView.as_view(), name='type-create'),
    path('type/<int:id>/update/',
         TypeEquipementUpdateView.as_view(), name='type-update'),
    path('type/<int:id>/delete/',
         TypeEquipementDeleteView.as_view(), name='type-delete'),

    # LocalisationEquipement URLs
    path('localisation/', LocalisationEquipementListView.as_view(),
         name='localisation-list'),
    path('localisation/create/', LocalisationEquipementCreateView.as_view(),
         name='localisation-create'),
    path('localisation/<int:id>/update/',
         LocalisationEquipementUpdateView.as_view(), name='localisation-update'),
    path('localisation/<int:id>/delete/',
         LocalisationEquipementDeleteView.as_view(), name='localisation-delete'),
]