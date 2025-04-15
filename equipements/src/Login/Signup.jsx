import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Ajout de Framer Motion
import logo from '../assets/logo.png';
import logoEsi from '../assets/ESI_Logo.png';
import { useAuth } from "../context/useAuth.jsx"; // Import du contexte d'authentification

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    numero: "",
    password: "",
    passwordConfirm: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Generic onChange handler to update formData state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerUser(
      formData.first_name,
      formData.last_name,
      formData.numero,
      formData.email,
      formData.password,
      formData.passwordConfirm
    );
  };

  return (
    <div className="flex h-screen bg-[#F4F4F4] ">
      {/* Partie gauche avec effet d'arrondi */}
      <div className="relative w-1/2 h-screen shadow-lg shadow-[#20599E] bg-[#20599E] flex flex-col justify-center items-center text-white p-10 rounded-r-[20px]">
        <img src={logo} alt="Logo ESI" className="mx-auto w-56 mb-30 transform -translate-y-5 translate-x- ml-12 " />
        <p className="mt-4 text-2xl text-[#F4F4F4] font-bold ml-0 ">Bienvenue sur ESI TRACK !</p>
        <img src={logoEsi} alt="LogoESI" className="w-32 mx-auto mb-20 ml-30 mt-7"  />
      </div>

      {/* Partie droite */}
      <div className="w-1/2 flex flex-col justify-center items-center ">
        <h2 className="text-4xl text-[#20599E] font-bold mb-9">S'inscrire</h2>

        {/* Formulaire */}
        <form className="w-80" onSubmit={handleRegister}>
          {[
            { name: "first_name", placeholder: "Nom" },
            { name: "last_name", placeholder: "Prénom" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "numero", placeholder: "Numéro", type: "text" },
          ].map(({ name, placeholder, type = "text" }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="w-full bg-[#F4F4F4] px-4 py-2 mb-4 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
            />
          ))}

          {/* Mot de passe */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#F4F4F4] px-4 py-2 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>

          {/* Confirmer le mot de passe */}
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirmer le mot de passe"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="w-full bg-[#F4F4F4] px-4 py-2 mb-4 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* Bouton Inscription */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="w-40 mx-auto block bg-[#F09C0A] hover:bg-[#F09C0A] text-white font-semibold py-2 rounded-full transition duration-200 active:scale-95 focus:ring-4 focus:ring-[#F09C0A] mt-6"
          >
            S'inscrire
          </motion.button>
        </form>

        <p className="mt-4 text-gray-600">
          Déjà un compte ?{" "}
          <Link to="/Login" className="text-[#F09C0A] font-semibold hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;