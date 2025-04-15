import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../assets/logo.png';
import logoEsi from '../assets/ESI_Logo.png';
import { FaGoogle } from "react-icons/fa";
import  { login } from "../api/endpoints.jsx";
import { useAuth } from "../context/useAuth";


const Login = () => {
 
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loginUser } = useAuth(); // Make sure this is present


  const handleNavigate = () => {
    nav('/signup')
}

  const handleLogin = async (e) => {
    e.preventDefault () ; 
    console.log("Form submitted");
    await loginUser (email  , password); 
  // Add your login logic here
};
  

  return (
    <div className="flex h-screen bg-[#F4F4F4] ">
      <div className="relative w-1/2 h-screen shadow-lg shadow-[#20599E] bg-[#20599E] flex flex-col justify-center items-center text-white p-10 rounded-r-[20px] shadow-lg">
        <img src={logo} alt="Logo ESI" className="mx-auto w-56 mb-30 transform -translate-y-5 translate-x- ml-12 " />
        <p className="mt-4 text-2xl text-[#F4F4F4] font-bold ml-0 ">Bienvenue sur ESI TRACK !</p>
        <img src={logoEsi} alt="LogoESI" className=" w-32 mx-auto mt-6 mt-5 " />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center">
          <>
            <h2 className="text-3xl text-[#20599E] font-bold mb-9 mt-[-20px]">Se connecter</h2>
           
            <form className="w-72"
            onSubmit={handleLogin}
             >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-[#F4F4F4] px-4 py-2 mb-4 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                value={email}
                 onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="w-full bg-[#F4F4F4] px-4 py-2 mb-4 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-40 mx-auto block bg-[#F09C0A] hover:bg-[#F09C0A] text-white font-semibold py-2 rounded-full transition duration-200 active:scale-95 focus:ring-4 focus:ring-[#F09C0A] "
              >
                Connexion
              </motion.button>
            </form>

            <motion.button
              whileHover={{ scale: 1.1 }}
              className="mt-3 text-black hover:underline"
            >
              Mot de passe oublié ?
            </motion.button>

            <p className="text-3xl my-6 text-black font-medium">ou</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-80 mx-auto block flex items-center justify-center py-2 bg-[#F09C0A]  text-white font-semibold rounded-full hover:bg-[#F09C0A] transition"
            >
              <FaGoogle size={20} className="mr-2" />
              Connexion avec Google @esi.dz
            </motion.button>

            <p className="mt-4 text-black">
              Pas encore de compte ?{" "}
              <motion.span whileHover={{ textDecoration: "underline" }}>
                <Link to="/register" className="text-[#F09C0A] font-semibold hover:underline">
                  Inscrivez-vous
                </Link>
              </motion.span>
            </p>
          </>
      </div>
    </div>
  );
};

export default Login;
