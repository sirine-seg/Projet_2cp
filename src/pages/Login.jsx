import React from "react";
import logoUrl from "../assets/logo.svg";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import esiLogo from "../assets/EsiWhite.svg";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Add this import


const Login = () => {
  const navigate = useNavigate(); // Add this hook
  const login = useGoogleLogin({
    flow: 'auth-code',
    redirect_uri: 'postmessage',  // ✅ Must match backend `callback_url`
    onSuccess: async (response) => {
      console.log("Received OAuth code:", response.code);

      try {
        const res = await axios.post(
          'https://esi-track-deployement.onrender.com/api/auth/google-code-exchange/',
          {
            code: response.code,
            redirect_uri: 'postmessage',
          },
          {
            withCredentials: false, // Since you want tokens in response body, cookies unnecessary
          }
        );

        console.log("Login successful:", res.data);

        const { access_token, refresh_token } = res.data;
        if (access_token) {
          localStorage.setItem('access_token', access_token);
          //localStorage.setItem('refresh_token', refresh_token);
        } else {
          console.warn('Tokens not found in response data');
        }

        navigate('/Home'); // Redirect after storing tokens
      } catch (err) {
        console.error("Login failed:", err.response?.data || err);
      }
    },
  });


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-shalke04 lg:bg-marbri font-poppins">
      {/* blue panel */}
      <aside className="bg-shalke04 text-white p-8 flex-shrink-0
                          w-full h-1/3 lg:w-1/2 lg:h-auto min-h-52 lg:rounded-r-[30px] lg:filter lg:drop-shadow-[5px_0_25px_rgba(32,33,36,0.8)]">
        <div className="flex flex-col  lg:items-start  md:items-center items-center lg:p-10 space-y-7  lg:mt-12 g-full">
          <img src={logoUrl} className="w-50 sm:w-65 lg:w-75 " />
          <h1 className="font-bold   text-xl  lg:text-3xl font-poppins ">Bienvenue sur ESI TRACK !</h1>
          <div className="hidden lg:flex absolute bottom-4 lg:bottom-8 left-0 right-0 justify-center">
            <img src={esiLogo} className="w-40 xl:w-50" />
          </div>
        </div>

      </aside>

      {/* login form */}

      <main className="flex flex-1 items-center justify-start sm:justify-center bg-marbri
      rounded-tl-[90px]  lg:rounded-none flex-col gap-4 pt-12
      ">

        <h2 className="text-3xl sm:text-4xl  text-shalke04  font-semibold mb-6 font-poppins ">Se connecter</h2>
        <form className="w-full max-w-lg gap-y-5  flex flex-col items-center mb-8">
          <input
            type="email"
            placeholder="email"
            className=" bg-transparent  w-4/5 border-4 border-solid border-[#C5C5C5] rounded-full px-4 py-3 focus:outline-none "
          />
          <input
            type="password"
            placeholder="mot de passe"
            className="bg-transparent  w-4/5 border-4 border-solid border-[#C5C5C5] rounded-full px-4 py-3 focus:outline-none"
          />
        </form>
        <button
          type="submit"
          className="w-3/5 sm:w-1/3 bg-JAUNE text-shalke04 font-poppins font-bold rounded-full py-3 cursor-pointer "
        >
          Connexion
        </button>

        <a className="hover:underline cursor-pointer text-[#5F6368]" >Mot de passe oublié?</a>
        <h1 className="text-shalke04 font-bold text-2xl">OU</h1>
        <button
          type="button"
          className="w-[95%] sm:w-[75%] mx-auto bg-JAUNE text-shalke04 font-poppins font-bold rounded-full py-3 flex items-center justify-center cursor-pointer mb-4 lg:mb-0"
          onClick={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <FaGoogle size={20} className="mr-2" />
          Connexion avec Google @esi.dz
        </button>

      </main>
    </div>
  );
}


export default Login;