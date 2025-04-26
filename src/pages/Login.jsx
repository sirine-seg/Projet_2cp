import React from "react";
import logoUrl from "../assets/EsiTrackLogo.svg";
import axios from 'axios'; 
import { useGoogleLogin } from '@react-oauth/google';
import esiLogo from "../assets/ESI_Logo.png" ; 


const Login = () => {

    const login = useGoogleLogin({
        flow: 'auth-code',
        redirect_uri: 'postmessage',  // ✅ Must match backend `callback_url`
        onSuccess: async (response) => {
          console.log("Received OAuth code:", response.code);
    
          try {
            
            const res = await axios.post('http://127.0.0.1:8000/api/auth/google-code-exchange/', {
              code: response.code,
              redirect_uri: 'postmessage',
            }, {
              withCredentials: true,  // Optional: for setting cookies if needed
            });
    
            console.log("Login successful:", res.data);
          } catch (err) {
            console.error("Login failed:", err.response?.data || err);
          }
        },
        onError: (err) => {
          console.error("Google login error:", err);
        },
      });



    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-shalke04 lg:bg-marbri">
        {/* blue panel */}  
        <aside className="bg-shalke04 text-white p-8 flex-shrink-0
                            w-full h-1/3 lg:w-1/2 lg:h-auto min-h-52 lg:rounded-tr-[35px] lg:shadow-lg   lg:shadow-black/50 ">
        <div className="flex flex-col  lg:items-start  md:items-center items-center lg:p-10 space-y-7  lg:mt-12">
          <img src={logoUrl} className="w-60 lg:w-75 "/>
          <h1 className="font-bold   text-xl  lg:text-3xl font-poppins ">Bienvenue sur ESI TRACK !</h1>
          </div>
          
        </aside>
  
        {/* login form */}
        
        <main className="flex flex-1 items-center justify-center p-8 bg-marbri
        rounded-tl-[90px]  lg:rounded-none flex-col 
        ">
            
          <form className="w-full max-w-lg gap-y-7  flex flex-col items-center ">
            <h2 className="text-4xl  text-shalke04  font-semibold mb-6 font-poppins ">Se connecter</h2>
            <input
              type="email"
              placeholder="email"
              className=" bg-transparent  w-4/5 border-4 border-solid border-gray-500 rounded-full px-4 py-3 focus:outline-none "
            />
            <input
              type="password"
              placeholder="mot de passe"
              className="bg-transparent  w-4/5 border-4 border-solid border-gray-500 rounded-full px-4 py-3 focus:outline-none"
            />
            <button
              type="submit"
              className=" w-2/3  lg:w-1/3 bg-JAUNE text-shalke04 font-poppins font-bold rounded-full py-4 cursor-pointer "
            >
              Connexion
            </button>
            <a className="hover:underline cursor-pointer" >mot de passe oublié</a>
            <h1 className="text-shalke04 font-bold text-2xl">OU</h1>
            <button type="button"
            className="w-full bg-JAUNE text-shalke04 font-poppins font-bold rounded-full py-4 cursor-pointer" 
            onClick={(e) => {
                e.preventDefault();      // stop the form submission
                login();
              }}
            >
            acceder via Google @esi.dz
        </button>
          </form>
        </main>
      </div>
    );
}


export default Login  ; 