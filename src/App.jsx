import { Routes, Route, BrowserRouter } from 'react-router-dom';

import HomePage from './pages/homePage.jsx';
import Login from './pages/Login.jsx';
import Profil from './pages/profil.jsx';
import Notifications from './pages/notifications.jsx';

import Users from './utilisateurs/users.jsx';
import Ajout from './utilisateurs/ajouttt.jsx';
import TechnicienDetails from "./utilisateurs/technicien.jsx";
import Modifie from "./utilisateurs/modifier.jsx";

import Intervention from "./interventions/intervention.jsx";
import Interventioninfo from "./interventions/interventioninfo";
import Interventionenattente from "./interventions/interventionenattente";
import Affecterintervention from "./interventions/affecterintervention";
import Ajoutintervention from "./interventions/ajouterintervention";
import Modifierintervention from "./interventions/modifierintervention.jsx";

import EquipementsPage from "./equipements/equip.jsx";
import AjoutPage from "./equipements/Ajout.jsx"
import EditPage from "./equipements/edit.jsx"
import Info from "./equipements/info.jsx";
import Signaler from "./equipements/signaler.jsx"
import SignalerAdmin from "./equipements/signalerAdmin.jsx";

import ChampsDynamiquesPage from './pages/ChampsDynamique.jsx';
import AideEtSupportPage from './pages/AideEtSupport.jsx';

import DashboardPage from "./dashboard/maindash.jsx";

function App() {
  return (
    
      <Routes>
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profil" element={<Profil />} />
        <Route path="/Notifications" element={<Notifications />} />

        <Route path="/equip" element={<EquipementsPage />} />
        <Route path="/Ajout" element={< AjoutPage/>} />
        <Route path="/edit/:id" element={<EditPage/>} />
        <Route path="/equipements/:id" element={<Info />} />
        <Route path="/signaler/:id" element={<Signaler />} />
        <Route path="/signalerAdmin/:id" element={<SignalerAdmin />} />

        <Route path="/Intervention" element={<Intervention />} />
        <Route path="/Interventionenattente" element={< Interventionenattente/>} />
        <Route path="/Ajoutintervention" element={< Ajoutintervention/>} />
        <Route path="/Modifierintervention/:id" element={< Modifierintervention />} />
        <Route path="/Affecterintervention/:id" element={< Affecterintervention />} />      
        
        <Route path="/Users" element={<Users />} />
        <Route path="/Modifie/:id" element={<Modifie/>} />
        <Route path="/Ajout" element={<Ajout />} />
        <Route path="/TechnicienDetails/:id" element={<TechnicienDetails />} />

        <Route path="/ChampsDynamiques" element={<ChampsDynamiquesPage />} />
        <Route path="/Aide" element={<AideEtSupportPage />} />

        <Route path="/dashboard" element={< DashboardPage/>} />
 
      </Routes>
    
  );
}

export default App;
