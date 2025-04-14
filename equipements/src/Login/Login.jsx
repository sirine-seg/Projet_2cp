import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../assets/logo.png';
import logoEsi from '../assets/ESI_Logo.png';
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  // State for credentials
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex h-screen bg-[#F4F4F4]">
      {/* Left Panel */}
      <div className="relative w-1/2 h-screen shadow-lg shadow-[#20599E] bg-[#20599E] flex flex-col justify-center items-center text-white p-10 rounded-r-[20px]">
        <img src={logo} alt="Logo ESI" className="mx-auto w-56 mb-6" />
        <p className="mt-4 text-2xl text-[#F4F4F4] font-bold">Bienvenue sur ESI TRACK !</p>
        <img src={logoEsi} alt="LogoESI" className="w-32 mx-auto mt-6" />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full mx-auto"></div>
            <p className="mt-4 text-lg font-semibold">Veuillez patienter...</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl text-[#20599E] font-bold mb-9 mt-[-20px]">Se connecter</h2>
            
            <form className="w-72">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-[#F4F4F4] px-4 py-2 mb-4 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                value={credentials.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="w-full bg-[#F4F4F4] px-4 py-2 mb-4 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="w-40 mx-auto block bg-[#F09C0A] hover:bg-[#e39009] text-white font-semibold py-2 rounded-full transition duration-200 active:scale-95 focus:ring-4 focus:ring-[#F09C0A]"
              >
                Connexion
              </motion.button>
            </form>

            <motion.button
              whileHover={{ scale: 1.1 }}
              className="mt-3 text-black hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Mot de passe oublié ?
            </motion.button>

            <p className="text-3xl my-6 text-black font-medium">ou</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-80 mx-auto block flex items-center justify-center py-2 bg-[#F09C0A] text-white font-semibold rounded-full hover:bg-[#e39009] transition"
            >
              <FaGoogle size={20} className="mr-2" />
              Connexion avec Google @esi.dz
            </motion.button>

            <p className="mt-4 text-black">
              Pas encore de compte ?{" "}
              <motion.span whileHover={{ textDecoration: "underline" }}>
                <Link to="/signup" className="text-[#F09C0A] font-semibold hover:underline">
                  Inscrivez-vous
                </Link>
              </motion.span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

