import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { FaGoogle } from "react-icons/fa";


const Registermobile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    numero: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://192.168.8.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Réponse du serveur :", response);
      console.log("Données reçues :", data);

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/loginmobile"), 2000);
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <div className="p-6 text-center">
       
        <h2 className="text-3xl text-white font-bold mb-6 text-center">S'inscrire</h2>
      
      </div>

      {/* Formulaire */}
      <div className="flex-1 bg-darck rounded-tl-[80px] p-6 shadow-lg flex flex-col justify-center">
      
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {success && (
          <p className="text-center text-green-500 mb-4">
            Inscription réussie ! Redirection en cours...
          </p>
        )}

        <form className="w-80 mx-auto space-y-4" onSubmit={handleSubmit}>
          
          {[
            { name: "first_name", placeholder: "Nom", type: "text" },
            { name: "last_name", placeholder: "Prénom", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            // { name: "numero", placeholder: "Numéro", type: "text" },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full text-black bg-darck px-4 py-2  border border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}

          {/* Mot de passe avec affichage/masquage */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full text-black bg-darck px-4 py-2 border border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-black"
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            className="w-40 mx-auto block bg-ddd text-white font-semibold py-3 rounded-full transition duration-200 active:scale-95 focus:ring-4 focus:ring-ddd mt-4"
          >
            S'inscrire
          </motion.button>
        </form>

         <p className="mt-8 mx-auto text-gray-600">
          Déjà un compte ?{" "}
          <Link to="/Loginmobile" className="text-ddd font-semibold hover:underline">
            Connectez-vous
          </Link>
        </p> 

      

        
      </div>
    </div>
  );
};

export default Registermobile;
