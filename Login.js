import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Ajout de Framer Motion
import logo from '../pages/LOGO-BLANC.png';
import logoEsi from '../pages/ESI_Logo.png';


const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // État de chargement
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialiser les erreurs
    setLoading(true); // Afficher le chargement

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      setTimeout(() => { // Simuler le temps de chargement
        setLoading(false);
        if (response.ok) {
          localStorage.setItem("accessToken", data.access);
          navigate("/dashboard"); // Rediriger après connexion
        } else {
          setError("Email ou mot de passe incorrect");
        }
      }, 300);
      
    } catch (err) {
      setLoading(false);
      setError("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <div className="flex h-screen bg-darck">
      {/* Partie gauche */}
      <div className="relative w-1/2 h-screen shadow-lg shadow-primary  bg-primary flex flex-col justify-center items-center text-white p-10 rounded-r-[20px] shadow-lg">
      <img src={logo} alt="Logo ESI" className="mx-auto w-56 mb-30 transform -translate-y-5 translate-x- ml-12 " />
      <p className="mt-4 text-2xl text-darck font-bold ml-0 ">Bienvenue sur ESI TRACK !</p>
        <img src={logoEsi} alt="LogoESI" className=" w-32  mx-auto  mt-5 " />
      </div>

      {/* Partie droite */}
      <div className="w-1/2 flex flex-col justify-center items-center ">
        {loading ? (
          // Écran de chargement
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full mx-auto"></div>
            <p className="mt-4 text-lg font-semibold">Veuillez patienter...</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl text-primary font-bold mb-9 mt-[-20px]">Se connecter</h2>

            {/* Affichage des erreurs */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Formulaire */}
            <form className="w-72" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-darck px-4 py-2 mb-4 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                value={credentials.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="w-full bg-darck px-4 py-2 mb-4 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                value={credentials.password}
                onChange={handleChange}
                required
              />

              {/* Bouton Connexion */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-40 mx-auto block bg-ddd hover:bg-ddd text-white font-semibold py-2 rounded-full 
                transition duration-200 active:scale-95 focus:ring-4 focus:ring-ddd"
              >
                Connexion
              </motion.button>
            </form>

            {/* Mot de passe oublié */}
            <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-3 text-black hover:underline"
          onClick={() => navigate("/forgot-password")}
        >
          Mot de passe oublié ?
        </motion.button>
            {/* Connexion avec Google */}
            <p className="text-3xl my-6 text-black font-medium">ou</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-80 mx-auto block flex items-center justify-center py-2 bg-ddd text-white font-semibold rounded-full hover:bg-ddd transition"
            >
              Connexion avec Google @esi.dz
            </motion.button>

            {/* Lien d'inscription */}
            <p className="mt-4 text-black">
              Pas encore de compte ?{" "}
              <motion.span whileHover={{ textDecoration: "underline" }}>
                <Link to="/register" className="text-ddd font-semibold hover:underline">
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