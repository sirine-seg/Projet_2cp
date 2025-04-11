import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import logo from '../pages/LOGO-BLANC.png';
import { FaGoogle } from "react-icons/fa";

const LoginMobile = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(" http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      setTimeout(() => {
        setLoading(false);
        if (response.ok) {
          localStorage.setItem("accessToken", data.access);
          navigate("/dashboard");
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
    <div className="w-full min-h-screen flex flex-col justify-between bg-primary">
      {/* Header */}
      <div className="text-center p-6">
      <img src={logo} alt="Logo ESI" className="w-32 mb-4 mx-auto" />
      
        <p className="text-2xl text-darck mt-15 sm:mt-10 md:mt-16">Bienvenue sur ESI TRACK !</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center bg-darck mt-20 px-6  py-8 min-h-[500px]  rounded-tl-[80px] shadow-md">
        <h2 className="text-3xl text-black font-semibold mb-6 text-center">
          Se connecter
        </h2>

        {/* Affichage des erreurs */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Champ Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 mb-3 bg-darck text-black border border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          {/* Champ Mot de passe avec bouton afficher/cacher */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              className="w-full bg-darck p-3 pr-10 text-black border border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>

          {/* Bouton Connexion avec gestion du chargement */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className={`w-40 mx-auto block bg-ddd text-white py-3 mt-4 rounded-full text-lg font-semibold transition duration-200 active:scale-95 focus:ring-4 focus:ring-ddd ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Connexion..." : "Connexion"}
          </motion.button>
        </form>

        {/* Mot de passe oublié */}
        <motion.p
          className="text-sm text-center mt-3"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/forgot-password" className="text-black underline">
            Mot de passe oublié?
          </Link>
        </motion.p>

        <div className="text-center  my-4 text-black">ou</div>

        {/* Connexion avec Google */}
        <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="w-full flex items-center justify-center bg-ddd text-white py-3 rounded-full text-lg font-semibold border border-gray-300 shadow-md hover:bg-gray-100 transition"
>
  <FaGoogle size={24} className="mr-3 text-white" /> {/* Icône bien alignée */}
  Connexion avec Google @esi.dz
</motion.button>


        {/* Lien d'inscription */}
        <p className="text-sm text-center mt-3 text-black">
          Pas encore de compte?{" "}
          <Link to="/Registermobile" className="text-ddd font-semibold">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginMobile;
