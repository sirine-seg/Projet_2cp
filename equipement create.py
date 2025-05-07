from equipements_management.models import LocalisationEquipement
from equipements_management.models import CategorieEquipement
from equipements_management.models import TypeEquipement, CategorieEquipement




def get_localisations_list():
    """
    Retrieve all localisation names as a list of strings from LocalisationEquipement table.
    """
    localisations_qs = LocalisationEquipement.objects.all()
    localisations_list = [loc.nom for loc in localisations_qs]
    return localisations_list

# Example usage:
localisations_array = get_localisations_list()



def create_and_get_categories():
    """
    Create 10 category instances and return them as a list.
    If categories with these names already exist, they will be reused.
    """
    category_names = [
        "Informatique",     # IT equipment
        "Laboratoire",      # Lab equipment
        "Mobilier",         # Furniture
        "Audio/Visuel",     # Audio/Visual equipment
        "Sécurité",         # Security and safety equipment
        "Électricité",      # Electrical equipment and tools
        "Pédagogique",      # Educational/teaching tools
        "Réseau",           # Networking equipment
        "Bureautique",      # Office equipment
        "Sportif"           # Sports and physical education equipment
    ]

    categories = []

    for name in category_names:
        category, created = CategorieEquipement.objects.get_or_create(nom=name)
        categories.append(category)

    return categories

# Example usage:
categories_array = create_and_get_categories()



from equipements_management.models import TypeEquipement, CategorieEquipement

def create_and_get_types():
    """
    Create TypeEquipement instances associated with existing categories.
    Assumes related categories exist.
    Returns a list of created or existing TypeEquipement objects.
    """
    equipment_types = {
        "Informatique": [
            "Ordinateur portable",
            "Ordinateur de bureau",
            "Serveur",
            "Clavier",
            "Souris",
            "Écran"
        ],
        "Laboratoire": [
            "Microscope",
            "Centrifugeuse",
            "Pipette électronique",
            "Balance de précision",
            "Hotte chimique"
        ],
        "Mobilier": [
            "Chaise",
            "Table",
            "Bureau",
            "Armoire",
            "Étagère"
        ],
        "Audio/Visuel": [
            "Vidéoprojecteur",
            "Écran de projection",
            "Haut-parleur",
            "Microphone",
            "Caméra"
        ],
        "Sécurité": [
            "Extincteur",
            "Caméra de surveillance",
            "Détecteur de fumée",
            "Trousse de premiers secours",
            "Alarme incendie"
        ],
        "Électricité": [
            "Multimètre",
            "Oscilloscope",
            "Alimentation électrique",
            "Fer à souder",
            "Câble électrique"
        ],
        "Pédagogique": [
            "Tableau blanc",
            "Marqueur",
            "Maquette pédagogique",
            "Rétroprojecteur",
            "Livres éducatifs"
        ],
        "Réseau": [
            "Routeur",
            "Switch",
            "Câble Ethernet",
            "Point d'accès Wi-Fi",
            "Baie de brassage"
        ],
        "Bureautique": [
            "Imprimante",
            "Scanner",
            "Photocopieur",
            "Relieuse",
            "Massicot"
        ],
        "Sportif": [
            "Ballon de basket",
            "Tapis de sol",
            "Cône d'entraînement",
            "Chronomètre",
            "Filet de volley"
        ]
    }

    types = []
    for category_name, type_names in equipment_types.items():
        try:
            category = CategorieEquipement.objects.get(nom=category_name)
        except CategorieEquipement.DoesNotExist:
            print(f"Category '{category_name}' does not exist. Skipping.")
            continue
        for type_name in type_names:
            type_equip, created = TypeEquipement.objects.get_or_create(nom=type_name, categorie=category)
            types.append(type_equip)

    return types

# Example usage:
types_array = create_and_get_types()








equipement = Equipement.objects.create(
    code="EQP-202410",
    nom="Ordinateur de bureau", 
    categorie=CategorieEquipement.objects.get(id=1),
    typee=TypeEquipement.objects.get (id=4),
    localisation=LocalisationEquipement.objects.get(id=9) , 
    etat = EtatEquipement.objects.get(id=1)

    # manuel and image can be set if files are available, otherwise omit or set None
)

equipement = Equipement.objects.create(
    code="EQP-202411",
    nom="Tableaux blancs interactifs", 
    categorie=CategorieEquipement.objects.get(id=1),
    typee=TypeEquipement.objects.get (id=5),
    localisation=LocalisationEquipement.objects.get(id=8) , 
    etat = EtatEquipement.objects.get(id=1)
    # manuel and image can be set if files are available, otherwise omit or set None
)


equipement = Equipement.objects.create(
    code="EQP-202412",
    nom="Onduleurs", 
    categorie=CategorieEquipement.objects.get(id=7),
    typee=TypeEquipement.objects.get (id=6),
    localisation=LocalisationEquipement.objects.get(id=7) , 
    etat = EtatEquipement.objects.get(id=1)
    # manuel and image can be set if files are available, otherwise omit or set None
)


equipement = Equipement.objects.create(
    code="EQP-202413",
    nom="Cartes FPGA", 
    categorie=CategorieEquipement.objects.get(id=7),
    typee=TypeEquipement.objects.get (id=7),
    localisation=LocalisationEquipement.objects.get(id=6),  
    etat = EtatEquipement.objects.get(id=1)
    # manuel and image can be set if files are available, otherwise omit or set None
)


equipement = Equipement.objects.create(
    code="EQP-202414",
    nom="Clusters GPU", 
    categorie=CategorieEquipement.objects.get(id=8),
    typee=TypeEquipement.objects.get (id=8),
    localisation = LocalisationEquipement.objects.get(id=5) , 
    etat = EtatEquipement.objects.get(id=1)
    # manuel and image can be set if files are available, otherwise omit or set None
)


equipement = Equipement.objects.create(
    code="EQP-202415",
    nom="Postes de test mobile", 
    categorie=CategorieEquipement.objects.get(id=7),
    typee=TypeEquipement.objects.get (id=9),
    localisation = LocalisationEquipement.objects.get(id=4) , 
    etat = EtatEquipement.objects.get(id=1)
    # manuel and image can be set if files are available, otherwise omit or set None
)


equipement = Equipement.objects.create(
    code="EQP-202416",
    nom="Switchs Ethernet managés", 
    categorie=CategorieEquipement.objects.get(id=7),
    typee=TypeEquipement.objects.get (id=10),
    localisation = LocalisationEquipement.objects.get(id=3) , 
    etat = EtatEquipement.objects.get(id=3)
    # manuel and image can be set if files are available, otherwise omit or set None
)



equipement = Equipement.objects.create(
    code="EQP-202417",
    nom="Stations de réalité virtuelle", 
    categorie=CategorieEquipement.objects.get(id=9),
    typee=TypeEquipement.objects.get (id=11),
    localisation = LocalisationEquipement.objects.get(id=3) , 
    etat = EtatEquipement.objects.get(id=3)
    # manuel and image can be set if files are available, otherwise omit or set None
)

equipement = Equipement.objects.create(
    code="EQP-202418",
    nom="Imprimantes 3D",  
    categorie=CategorieEquipement.objects.get(id=1),
    typee=TypeEquipement.objects.get (id=12),
    localisation = LocalisationEquipement.objects.get(id=2) , 
    etat = EtatEquipement.objects.get(id=3)
    # manuel and image can be set if files are available, otherwise omit or set None
)


equipement = Equipement.objects.create(
    code="EQP-202419",
    nom="Tablettes graphiques", 
    categorie=CategorieEquipement.objects.get(id=1),
    typee=TypeEquipement.objects.get (id=13),
    localisation = LocalisationEquipement.objects.get(id=1) , 
    etat = EtatEquipement.objects.get(id=2)
    # manuel and image can be set if files are available, otherwise omit or set None
)






