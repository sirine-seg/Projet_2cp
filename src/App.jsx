
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Profil from './pages/profil.jsx';
import Users from './utilisateurs/users.jsx';
import Ajout from './assets/ajouttt.jsx';
import TechnicienDetails from "./assets/technicien.jsx";
import Modifie from "./assets/modifier.jsx";
import Intervention from "./assets/intervention.jsx";
import Interventioninfo from "./assets/interventioninfo";
import Interventionenattente from "./assets/interventionenattente";
import Affecterintervention from "./assets/affecterintervention";
import Ajoutintervention from "./assets/ajouterintervention";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Profil" element={<Profil />} />
        <Route path="/Users" element={<Users />} />
         <Route path="/Modifie/:id" element={< Modifie/>} />
          <Route path="/Ajout" element={< Ajout />} />
         <Route path="/TechnicienDetails/:id" element={< TechnicienDetails />} />
          <Route path="/Intervention" element={< Intervention />} />
         <Route path="/Interventionenattente" element={< Interventionenattente/>} />
         <Route path="/Ajoutintervention" element={< Ajoutintervention/>} />
           <Route path="/Modifierintervention/:id" element={< Modifierintervention />} />
            <Route path="/Affecterintervention/:id" element={< Affecterintervention />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
