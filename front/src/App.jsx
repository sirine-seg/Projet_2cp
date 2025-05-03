import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Users from "./assets/users.jsx";
import Modifie from "./assets/modifier.jsx";
import EquipementsPage from "./equipements/equip.jsx";
import AjoutPage from "./equipements/Ajout.jsx";
import EditPage from "./equipements/edit.jsx";
import Info from "./equipements/info.jsx";
import Signaler from "./equipements/signaler.jsx";
import SignalerAdmin from "./equipements/signalerAdmin.jsx";
import DashboardPage from "./dashboard/maindash.jsx";
import Login from "./equipements/login.jsx";
import SignalerPer from "./equipements/signalerPer.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Users" element={<Users />} />
        <Route path="/login" element={<Login />} />


        <Route path="/Modifie/:id" element={<Modifie />} />
        <Route path="/equip" element={<EquipementsPage />} />
        <Route path="/Ajout" element={<AjoutPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/equipements/:id" element={<Info />} />
        <Route path="/signaler/:id" element={<Signaler />} />
        <Route path="/signalerper" element={<SignalerPer />} /> {/* Corrected path and spacing */}
        <Route path="/signalerAdmin/:id" element={<SignalerAdmin />} />
        <Route path="/dashboard" element={<DashboardPage />} />

      </Routes>
    </Router>
  );
}

export default App;