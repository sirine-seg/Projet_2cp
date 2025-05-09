import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from "react";

import HomePage from './pages/homePage.jsx';
import Login from './pages/Login.jsx';
import Profil from './pages/profil.jsx';
import Notifications from './pages/notifications.jsx';

import Users from './utilisateurs/users.jsx';
import AjouterUser from './utilisateurs/ajouttt.jsx';
import DetailsUser from './utilisateurs/technicien.jsx';
import Modifie from './utilisateurs/modifier.jsx';

import Intervention from './interventions/intervention.jsx';
import Interventioninfo from './interventions/interventioninfo.jsx';
import Affecterintervention from './interventions/affecterintervention.jsx';
import Modifierintervention from './interventions/modifierintervention.jsx';
import AjouterInterventionRedirect from './redirect/AjouterInterventionRedirect.jsx';

import TacheTech from './interventions/tacheTech.jsx';

import EquipementsPage from './equipements/equip.jsx';
import AjoutPage from './equipements/Ajout.jsx';
import EditPage from './equipements/edit.jsx';
import Info from './equipements/info.jsx';
import SignalerRedirect from './redirect/SignalerRedirect.jsx';

import GeneralPage from './pages/GeneralPage.jsx';
import ChampsDynamiquesPage from './pages/ChampsDynamique.jsx';
import AideEtSupportPage from './pages/AideEtSupport.jsx';

import DashboardPage from './dashboard/maindash.jsx';

function App() {

  const [userRole, setUserRole] = useState(null); // État pour le rôle
  const [loading, setLoading] = useState(true); // État de chargement

  useEffect(() => {
    // Fonction pour récupérer le rôle de l'utilisateur depuis l'API
    const fetchUserRole = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error("Aucun token trouvé");
          return;
        }

        const response = await fetch("http://localhost:8000/api/accounts/me/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Mise à jour du rôle dans l'état
          setUserRole(data?.role || data?.user?.role);
        } else {
          console.error("Erreur lors de la récupération du rôle");
        }
      } catch (error) {
        console.error("Erreur de connexion à l'API :", error);
      } finally {
        setLoading(false); // On termine le chargement
      }
    };

    fetchUserRole();
  }, []); // Lancer la requête une seule fois à l'initialisation


  return (
    
      <Routes>

        <Route path="/Home" element={< HomePage />} />
        <Route path="/Login" element={< Login />} />
        <Route path="/Profil" element={< Profil />} />
        <Route path="/Notifications" element={< Notifications />} />


        <Route path="/Equipements" element={< EquipementsPage />} />
        <Route path="/AjouterEquipement" element={< AjoutPage/>} />
        <Route path="/ModifierEquipement/:id" element={< EditPage/>} />
        <Route path="/DetailsEquipement/:id_equipement" element={<Info />} />
        <Route path="/Signaler/:id_equipement" element={<SignalerRedirect userRole={userRole} />} />


        <Route path="/Interventions" element={< Intervention />} />
        <Route path="/AjouterIntervention" element={< AjouterInterventionRedirect userRole={userRole} />} />
        <Route path="/ModifierIntervention/:id" element={< Modifierintervention />} />
        <Route path="/AffecterIntervention/:id_intervention" element={< Affecterintervention />} />
        <Route path="/DetailsIntervention/:id" element={< Interventioninfo />} />


        <Route path="/MesTaches" element={<TacheTech />} />     

        
        <Route path="/Utilisateurs" element={< Users />} />
        <Route path="/ModifierUtilisateur/:id" element={< Modifie/>} />
        <Route path="/AjouterUtilisateur" element={< AjouterUser />} />
        <Route path="/DetailsUtilisateur/:id" element={< DetailsUser />} />


        <Route path="/Generale" element={< GeneralPage />} />
        <Route path="/ChampsDynamiques" element={< ChampsDynamiquesPage />} />
        <Route path="/Aide" element={< AideEtSupportPage />} />
        

        <Route path="/dashboard" element={< DashboardPage/>} />
 
      </Routes>
    
  );
}

export default App;