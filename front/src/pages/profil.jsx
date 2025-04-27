import React from "react";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import Profil from "../assets/Profil.svg";
import DisModContainer from "../components/disModContainer";
import DisplayContainer from "../components/displayContainer";
import Button from "../components/Button";
import { LogOut } from "lucide-react";

export default function ProfilePage() {

  const isTechnicien = false;

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
      <Header />
      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] mt-20 md:mt-28">
        <Headerbar title="Mon profile" profilOrNotif="true" />

        {/* Profil */}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-24 mb-6 px-4 mb:px-10">

          {/* Photo et boutons */}
          <div className={`flex flex-row md:flex-col items-center ${isTechnicien ? "gap-10 sm:gap-24 md:gap-6" : "gap-10"} `}>
            <img src={Profil} alt="Profil" className="w-30 h-30 flex-shrink-0" />
            <div className="flex flex-col items-center gap-4">
              <Button text="Modifier photo" />
              {isTechnicien && <Button text="Voir mes tâches" bgColor="#F09C0A" />}
            </div>
          </div>

          {/* Containers */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 w-full">
              <DisModContainer title="Nom" initialContent="test" />
              <DisModContainer title="Prenom" initialContent="test" />
              <DisplayContainer title="Identifiant" content="test" />
              <DisplayContainer title="Role" content="test" />
              {isTechnicien && <div className="md:col-span-2 flex justify-center"> 
                <DisModContainer title="Poste" initialContent="test" />
              </div>}
          </div>
        </div>

        {/* Containers - Numero de telephone et email */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 md:gap-20 md:my-10 px-4 mb:px-10">
          <DisModContainer title="Numero de telephone" initialContent="test" />
          <DisplayContainer title="E-Mail" content="test" />
        </div>

        {/* Se deconnecter */}
        <div className="flex items-center text-red-500 cursor-pointer gap-2 ml-5">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Se déconnecter</span>
        </div>
      </div>
    </div>
  );
}  
