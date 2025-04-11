import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registermobile from "./pages/registermobile";
import Home from "./pages/Home";
import Register from "./pages/Register";
import UtilisateurDetails from "./pages/adminpersonnel";
import TechnicienDetails from "./pages/technicien";
import Modifie from "./pages/modifier";
import Ajout from "./pages/ajout";
import Ajoutmobile from "./pages/ajoutmobile";
import Ajouttechnicienmobile from "./pages/ajouttechnicienmobile";
import AjoutTechnicien from "./pages/ajouttechnicien";
import ModifierTechnicien from "./pages/modifiertechnicien";
import Modifiermobile from "./pages/modifiemobile";
 import Modifierintervention from "./pages/modifierintervention";
import Users  from "./pages/users";
import Anfel  from "./pages/anfel";
import Intervention from "./pages/intervention";
import Loginmobile from "./pages/Loginmobileee";
import Usersmobile from "./pages/Usersmobile";
import Affecterintervention from "./pages/affecterintervention";
import Interventiontechnicien from "./pages/interventiontechnicien";
import MotDePasseOublie from "./pages/motdepasse";





function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Home />} /> 
     
         <Route path="/Login" element={< Login />} />
        <Route path="/Register" element={< Register />} />
        <Route path="/Loginmobile" element={< Loginmobile />} />
        <Route path="/Registermobile" element={< Registermobile />} />
        <Route path="/Anfel" element={< Anfel />} />
        <Route path="/Users" element={< Users />} />
        <Route path="/Ajout" element={< Ajout />} />
        <Route path="/UtilisateurDetails/:id" element={<UtilisateurDetails />} />
        <Route path="/TechnicienDetails/:id" element={< TechnicienDetails />} />
        <Route path="/Modifie/:id" element={< Modifie/>} />
        <Route path="/Usersmobile" element={< Usersmobile/>} />
        <Route path="/Ajoutmobile" element={< Ajoutmobile />} />
        <Route path="/Ajouttechnicienmobile" element={<  Ajouttechnicienmobile />} />
        <Route path="/AjoutTechnicien" element={< AjoutTechnicien />} />
        <Route path="/Modifiermobile" element={< Modifiermobile />} />
        <Route path="/Intervention" element={< Intervention />} />
        <Route path="/Affecterintervention" element={< Affecterintervention />} />
        <Route path="/ModifierTechnicien" element={< ModifierTechnicien />} />
        <Route path="/Modifierintervention" element={< Modifierintervention />} />
        <Route path="/Interventiontechnicien" element={< Interventiontechnicien />} />
      </Routes>
    </Router>
  );
}

export default App