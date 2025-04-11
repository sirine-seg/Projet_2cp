import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

import Home from "./pages/Home";
import Register from "./pages/Register";




function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Home />} /> 
     
         <Route path="/Login" element={< Login />} />
        <Route path="/Register" element={< Register />} />
      
      </Routes>
    </Router>
  );
}

export default App
