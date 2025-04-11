import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Registermobile from "./pages/registermobile";
import Loginmobile from "./pages/Loginmobileee";




function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Home />} /> 
     
         <Route path="/Login" element={< Login />} />
        <Route path="/Register" element={< Register />} />
        <Route path="/Loginmobile" element={< Loginmobile />} />
        <Route path="/Registermobile" element={< Registermobile />} />
      
      </Routes>
    </Router>
  );
}

export default App
