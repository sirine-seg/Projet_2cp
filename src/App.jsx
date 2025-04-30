
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Profil from './pages/profil.jsx';
import Users from './utilisateurs/users.jsx';
import Ajout from './assets/ajouttt.jsx';
import TechnicienDetails from "./assets/technicien.jsx";
import Modifie from "./assets/modifier.jsx";
import Intervention from "./assets/intervention.jsx";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
