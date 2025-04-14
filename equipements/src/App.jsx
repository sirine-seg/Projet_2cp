import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import  EquipementsPage from './equip.jsx';
import   AjoutPage from './ajout_page.jsx';
import EditPage from "./edit.jsx";
import Info from "./info.jsx"
import Singnaler from "./signaler.jsx"
import  SignalerAdmin from "./signalerAdmin.jsx"


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Router>
            <Routes>
               <Route path="/" element={< EquipementsPage />} />
               <Route path="/ajouter" element={< AjoutPage />} />
               <Route path="/equipements/:id" element={<Info />} />
               <Route path="/edit/:id" element={<EditPage />} />
               <Route path="/signaler/:id" element={<Singnaler />} />
               <Route path="/signalerAdmin/:id" element={<SignalerAdmin />} />

               
            </Routes>
        </Router>
      
    </>
  )
}

export default App
