

import { useState } from 'react'
import './App.css'
import icon1 from './assets/icon1.png';
import icon2 from './assets/icon2.png';
import icon3 from './assets/icon3.png';
import tech from './assets/tech.png';
import logo from './assets/logo.png';
import { Mail } from "lucide-react";
import { FaAndroid, FaApple } from "react-icons/fa";
import  FAQ  from './FAQ.jsx';




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className=" body min-h-screen bg-zinc-100">
      <div className=" blue_wave   inline-flex items-center gap-[54px] bg-[#20599E] flex-wrap min-w-full h-[650px] " >
      <div className="navbar flex flex-wrap items-center justify-between w-full px-6 py-4">
  <img className="h-12" src={logo} />
  <button className="bg-amber-500 rounded-full px-6 py-2 text-white text-xl font-semibold">Connexion</button>
</div>

        <div className="flex relative min-w-full items-center justify-between  px-14 ">
      <div className=" content     mx-14  w-[550px]">
     <div className=" ktiba1  text-white font-montserrat text-[50px] font-bold leading-normal h-[206px] opacity-90 --tw-border-opacity: 1">
      <p>Optimisez la gestion de maintenance avec ESI Track!</p>
      </div>
      <div className="ktiba2 my-9 self-stretch text-[#F4F4F4] font-[Montserrat] text-[25px] font-medium leading-[32px] opacity-70 leading-loose text-lg leading-tight">
        <p>Suivez facilement les réparations et améliorez l'efficacité de l'ESI grâce à une gestion simple et intuitive.</p>
      </div>
      <button className="w-80 h-16 bg-amber-500 rounded-[100px] justify-start text-white text-xl font-semibold font-['Poppins'] ">commencez maintenant</button>
      
     </div>
     <div className="icons w-[400px] h-[400px]  ">
     <img class="self-stretch h-90" src={tech} />

     </div>
     </div>
     </div>
     
     <div class="custom-shape-divider-bottom-1742461672">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
    </svg>
    
</div>
<div className="gray-wave  bg-[#f4f4f5] flex-wrap min-w-full h-[1100px]">
<div class="content flex flex-col items-start">
<div class=" features relative mt-48 mx-auto text-center w-48   justify-start text-blue-800 text-5xl font-bold font-['Poppins'] leading-[52px]">Features</div>
<div class=" relative mx-auto mt-10 text-center w-[1024px]  h-28 opacity-70   text-gray-600 text-xl font-medium font-['Poppins'] leading-loose">Suivez en temps réel l'état des équipements, signalez les problèmes, et planifiez les interventions. Accédez à des rapports détaillés, suivez l'historique des maintenances, et recevez des alertes pour optimiser les opérations et minimiser les temps d'arrêt.</div>

<div class="squares w-[1113.33px] h-96 relative mt-44 ml-20">
    <div class="w-80 h-96 left-0 top-[2px] absolute">
        <div class="w-80 h-96 left-0 top-0 absolute bg-zinc-100 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-gray-600/30"></div>
        <div class="w-80 left-[0.33px] top-[53px] absolute inline-flex flex-col justify-start items-center gap-[5px]">
            <div class="w-28 h-40 flex flex-col justify-start items-center">
                <img class="self-stretch h-28" src={icon1} />
                <div class="self-stretch text-center justify-start text-blue-800 text-2xl font-bold font-['Poppins'] leading-[52px]">Suivre</div>
            </div>
            <div class="w-72 text-center justify-start text-gray-600 text-base font-normal font-['Poppins'] leading-relaxed">Suivez en temps réel l'état des équipements et consultez les données de maintenance détaillées.</div>
        </div>
    </div>
    <div class="w-80 h-96 left-[398.22px] top-[2px] absolute">
        <div class="w-80 h-96 left-0 top-0 absolute bg-zinc-100 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-gray-600/30"></div>
        <div class="w-80 left-[0.11px] top-[57px] absolute inline-flex flex-col justify-start items-center gap-[5px]">
            <div class="w-28 h-40 flex flex-col justify-start items-center gap-1">
                <img class="self-stretch h-28" src={icon2} />
                <div class="self-stretch text-center justify-start text-blue-800 text-2xl font-bold font-['Poppins'] leading-[52px]">Gérer</div>
            </div>
            <div class="w-72 text-center justify-start text-gray-600 text-base font-normal font-['Poppins'] leading-relaxed">Planifiez les interventions, assignez des tâches et optimisez les opérations de maintenance.</div>
        </div>
    </div>
    <div class="w-80 h-96 left-[788.33px] top-0 absolute">
        <div class="w-80 h-96 left-[0.11px] top-0 absolute bg-zinc-100 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-gray-600/30"></div>
        <div class="w-80 h-64 left-0 top-[56px] absolute inline-flex flex-col justify-start items-center gap-[5px]">
            <div class="w-28 h-40 flex flex-col justify-start items-center">
                <img class="self-stretch h-28" src={icon3} />
                <div class="self-stretch text-center justify-start text-blue-800 text-2xl font-bold font-['Poppins'] leading-[52px]">Signaler</div>
            </div>
            <div class="w-64 text-center justify-start text-gray-600 text-base font-normal font-['Poppins'] leading-relaxed">Signalez rapidement les pannes et incidents pour une intervention efficace et rapide.</div>
        </div>
    </div>
   
</div>
</div>
</div>
<div class="custom-shape-divider-bottom-1742465065">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
    </svg>
</div>
<div className="white-wave inline-flex items-center gap-[54px] bg-[#ffffff] flex-wrap min-w-full h-[1100px]">
<FAQ />
</div>

<div className="footer  bg-[#20599E]  min-w-full h-[506px] ">
  <div className="container flex relative min-w-full items-center justify-between  px-14 ">
<div className="info  mt-20">
<img class="self-stretch relative h-25 ml-10 " src={logo} />
<div class="w-[480px] justify-start text-zinc-100 text-3xl font-medium font-['Poppins'] mt-10 ml-9">En savoir plus sur ESI TRACK :</div>
<div class="self-stretch justify-start text-zinc-100 text-xl font-normal font-['Poppins'] mt-7 ml-9">
  <a href="#" class="hover:text-2xl hover:shadow-lg hover:shadow-zinc-100 transition-all duration-200">
    Manuel d'utilisation
  </a>
</div>
<div class="self-stretch justify-start text-zinc-100 text-xl font-normal font-['Poppins'] mt-3 ml-9">
  <a href="#" class="hover:text-2xl hover:shadow-lg hover:shadow-zinc-100 transition-all duration-200">
    Conditions d'utilisation
  </a>
</div>
<div class="self-stretch justify-start text-zinc-100 text-xl font-normal font-['Poppins'] mt-3 ml-9">
  <a href="#" class="hover:text-2xl hover:shadow-lg hover:shadow-zinc-100 transition-all duration-200">
    Politique de confidentialité
  </a>
</div>
</div>
<div className="icons">
<div class="w-44 justify-start text-zinc-100 text-xl font-medium font-['Poppins']">Contactez-nous</div>
<div className="mail flex items-center ">
<Mail className="text-zinc-100 "/>
<div class="justify-start text-zinc-100 text-xl font-normal font-['Poppins'] ml-5">EsiTrack@esi.dz</div>
</div>
<div class="w-44 justify-start text-zinc-100 text-xl font-medium font-['Poppins'] mt-16 ">Disponible sur</div>
<button className="flex items-center gap-2 px-4 py-2 text-white border border-white rounded-[20px] p-4 mt-6">
<FaAndroid className="w-5 h-5" />
      <span>Android</span>
      
    </button>
    <button className="flex items-center gap-2 px-4 py-2 text-white border border-white w-[120px] rounded-[20px] p-4 mt-3  ">
    <FaApple className="text-zinc-100 " />
      <span>iOS</span>
      
    </button>
      
</div>
</div>
<div class="w-[1282px] px-10 inline-flex justify-between items-end mt-20">
    <div class="justify-start text-zinc-100 text-base font-normal font-['Poppins']">© 2025 ESI TRACK. All rights reserved.</div>
    <div class="justify-start text-zinc-100 text-base font-normal font-['Poppins'] leading-tight">Ecole Nationale Supérieure d'Informatique</div>
    </div>
</div>
</div>


    </>
  )
}

export default App

