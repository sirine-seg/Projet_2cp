import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from './sidebar.jsx';
import './App.css';

import EquipementsPage from './equipements/equip.jsx';
import AjoutPage from './equipements/ajout_page.jsx';
import EditPage from "./equipements/edit.jsx";
import Info from "./equipements/info.jsx";
import Singnaler from "./equipements/signaler.jsx";
import SignalerAdmin from "./equipements/signalerAdmin.jsx";

import Users from "./users/user.jsx";
import TechnicienDetails from "./users/technicien.jsx";
import UtilisateurDetails from "./users/adminpersonnel.jsx";
import Tacheechnicien from "./users/tachetechnicien.jsx";
import ModifierTechnicien from "./users/modifiertechnicien.jsx";
import Modifie from "./users/modifier.jsx";
import Ajout from "./users/ajout";
import AjoutTechnicien from "./users/ajouttechnicien.jsx";

import Intervention from "./intervention/intervention.jsx";
import Interventionenattente from "./intervention/interventionenattente.jsx";
import Interventioninfo from "./intervention/interventioninfo.jsx";
import Modifierintervention from "./intervention/modifierintervention.jsx";
import Affecterintervention from "./intervention/affecterintervention.jsx";

import Usersp from "./users/userp.jsx";
import TechnicienDetailsp from "./users/technicienp.jsx";
import UtilisateurDetailsp from "./users/adminpersonnelp.jsx";
import Userst from "./users/userst";
import TechnicienDetailstt from "./users/technicientt.jsx";
import UtilisateurDetailstt from "./users/adminpersonneltt.jsx";

import LandingPage from "./landingPage/landingpage.jsx";
import Register from "./Login/signup.jsx";
import Login from "./Login/Login.jsx";

// AppContent separates layout logic
function AppContent() {
  const location = useLocation();
  const noSidebarPaths = ["/land", "/signup", "/login"];

  const isNoSidebar = noSidebarPaths.includes(location.pathname);

  return (
    <>
      {isNoSidebar ? (
        // Routes WITHOUT Sidebar
        <Routes>
          <Route path="/land" element={<LandingPage />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        // Routes WITH Sidebar
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<EquipementsPage />} />
              <Route path="/ajouter" element={<AjoutPage />} />
              <Route path="/equipements/:id" element={<Info />} />
              <Route path="/edit/:id" element={<EditPage />} />
              <Route path="/signaler/:id" element={<Singnaler />} />
              <Route path="/signalerAdmin/:id" element={<SignalerAdmin />} />

              <Route path="/Users" element={<Users />} />
              <Route path="/TechnicienDetails/:id" element={<TechnicienDetails />} />
              <Route path="/UtilisateurDetails/:id" element={<UtilisateurDetails />} />
              <Route path="/Tacheechnicien/:id" element={<Tacheechnicien />} />
              <Route path="/ModifierTechnicien" element={<ModifierTechnicien />} />
              <Route path="/Modifie/:id" element={<Modifie />} />
              <Route path="/Ajout" element={<Ajout />} />
              <Route path="/AjoutTechnicien" element={<AjoutTechnicien />} />

              <Route path="/Intervention" element={<Intervention />} />
              <Route path="/Interventionenattente" element={<Interventionenattente />} />
              <Route path="/Interventioninfo/:id" element={<Interventioninfo />} />
              <Route path="/Modifierintervention/:id" element={<Modifierintervention />} />
              <Route path="/Affecterintervention/:id" element={<Affecterintervention />} />

              <Route path="/Usersp" element={<Usersp />} />
              <Route path="/TechnicienDetailsp/:id" element={<TechnicienDetailsp />} />
              <Route path="/UtilisateurDetailsp/:id" element={<UtilisateurDetailsp />} />
              <Route path="/Userst" element={<Userst />} />
              <Route path="/TechnicienDetailstt/:id" element={<TechnicienDetailstt />} />
              <Route path="/UtilisateurDetailstt/:id" element={<UtilisateurDetailstt />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
