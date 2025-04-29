import React from "react";
import logo from "../assets/logo.png";
import axios from 'axios'; 
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';  // Importation de useNavigate

const Login = () => {
  const navigate = useNavigate();  // Déclaration de la fonction de navigation

  const login = useGoogleLogin({
    flow: 'auth-code',
    redirect_uri: 'postmessage',  // ✅ Doit correspondre au `callback_url` du backend
    onSuccess: async (response) => {
        console.log("Received OAuth code:", response.code);
      
        try {
          const res = await axios.post('http://127.0.0.1:8000/api/auth/google-code-exchange/', {
            code: response.code,
            redirect_uri: 'postmessage',
          });
      
          console.log("Login successful:", res.data);
      
          // Add a simple check to confirm navigation
          if (res.data.success) {
            navigate('/equip');  // Successful login redirects to the dashboard
          } else {
            console.error("Login failed: ", res.data.message);
          }
        } catch (err) {
          console.error("Login failed:", err.response?.data || err);
        }
      },
      
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#20599E] lg:bg-zinc-100">
      {/* Blue panel */}
      <aside className="bg-[#20599E] text-white p-8 flex-shrink-0
                          w-full h-1/3 lg:w-1/2 lg:h-auto min-h-52 lg:rounded-tr-[35px] lg:shadow-lg lg:shadow-black/50">
        <div className="flex flex-col lg:items-start md:items-center items-center lg:p-10 space-y-7 lg:mt-12">
          <img src={logo} className="w-60 lg:w-75" />
          <h1 className="font-bold text-xl lg:text-3xl font-poppins">Bienvenue sur ESI TRACK !</h1>
        </div>
      </aside>

      {/* Login form */}
      <main className="flex flex-1 items-center justify-center p-8 bg-zinc-100
                      rounded-tl-[90px] lg:rounded-none flex-col">
        <form className="w-full max-w-lg gap-y-7 flex flex-col items-center">
          <h2 className="text-4xl text-[#20599E] font-semibold mb-6 font-poppins">Se connecter</h2>
          <input
            type="email"
            placeholder="email"
            className="bg-transparent w-4/5 border-4 border-solid border-gray-500 rounded-full px-4 py-3 focus:outline-none"
          />
          <input
            type="password"
            placeholder="mot de passe"
            className="bg-transparent w-4/5 border-4 border-solid border-gray-500 rounded-full px-4 py-3 focus:outline-none"
          />
          <button
            type="submit"
            className="w-2/3 lg:w-1/3 bg-[#F09C0A] text-[#20599E] font-poppins font-bold rounded-full py-4 cursor-pointer"
          >
            Connexion
          </button>
          <a className="hover:underline cursor-pointer">mot de passe oublié</a>
          <h1 className="text-[#20599E] font-bold text-2xl">OU</h1>
          <button
            type="button"
            className="w-full bg-[#F09C0A] text-[#20599E] font-poppins font-bold rounded-full py-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault(); // Empêche l'envoi du formulaire
              login(); // Appelle la fonction login pour la connexion Google
            }}
          >
            accéder via Google @esi.dz
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;

