import { Routes, Route, BrowserRouter } from 'react-router-dom';

import HomePage from './pages/homePage.jsx';
import Login from './pages/Login.jsx';
import Profil from './pages/profil.jsx';
import Notifications from './pages/notifications.jsx';

import Users from './utilisateurs/users.jsx';
import AjouterUser from './utilisateurs/ajouttt.jsx';
import DetailsUser from "./utilisateurs/technicien.jsx";
import Modifie from "./utilisateurs/modifier.jsx";

import Intervention from "./interventions/intervention.jsx";
import Interventioninfo from "./interventions/interventioninfo";
import Affecterintervention from "./interventions/affecterintervention";
import Ajoutintervention from "./interventions/ajouterintervention";
import Modifierintervention from "./interventions/modifierintervention.jsx";
import SignalerPers from "./interventions/signalerPers.jsx";

import TacheTech from "./interventions/tacheTech.jsx";

import EquipementsPage from "./equipements/equip.jsx";
import AjoutPage from "./equipements/Ajout.jsx"
import EditPage from "./equipements/edit.jsx"
import Info from "./equipements/info.jsx";
import Signaler from "./equipements/signaler.jsx"
import SignalerAdmin from "./equipements/signalerAdmin.jsx";

import GeneralPage from './pages/GeneralPage.jsx';
import ChampsDynamiquesPage from './pages/ChampsDynamique.jsx';
import AideEtSupportPage from './pages/AideEtSupport.jsx';

import DashboardPage from "./dashboard/maindash.jsx";

function App() {
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
        <Route path="/Signaler/:id_equipement" element={< Signaler />} />
        <Route path="/signalerAdmin/:id_equipement" element={< SignalerAdmin />} />


        <Route path="/Interventions" element={< Intervention />} />
        <Route path="/AjouterIntervention" element={< Ajoutintervention/>} />
        <Route path="/AjouterPers" element={<SignalerPers />} />
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