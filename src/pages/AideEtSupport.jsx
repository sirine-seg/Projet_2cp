import Breadcrumb from "../components/breadCrumbs";
import Header from "../components/Header";
import SideBar from "../components/sideBar";
import { Download, Mail } from "lucide-react";

export default function AideEtSupportPage({}) {
  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="fixed top-0 left-0 h-screen w-64 z-30">
        <SideBar isOpen="true" />
      </div>

      <div className="top-0 left-0 right-0 z-20">
        <Header bleu />
      </div>

      <div className="ml-80 pt-10 p-6 mr-24">
        <div className="mb-8">
          <Breadcrumb path={["Guide d'utilisateur"]} />
        </div>
        <div className="ml-10">
          <button className="flex cursor-pointer items-center bg-white text-[#202124] font-medium py-2 px-4 rounded-lg mb-10 transition-colors">
            <Download className="mr-2 h-5 w-5" />
            Telecharger le guide
          </button>
        </div>

        <div className="mb-8">
          <Breadcrumb path={["Contactez nous!"]} />
        </div>

        <div className="ml-10 mb-10">
        <div className="flex-col">
        <h3 className="text-2xl font-semibold text-[#202124] mb-4">
          Boite principale
        </h3>
        <div className="flex items-center mb-12 mt-4">
          <Mail className="text-[#202124] h-5 w-5" />
          <span className="ml-2 text-[#202124] font-semibold">esiTrack@esi.dz</span>
        </div>
        </div>

        <h3 className="text-2xl font-semibold text-[#202124] mb-4">
          Contributeurs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Mail className="text-[#202124] mr-2 h-5 w-5" />
            <span className="text-[#202124] font-semibold">ns_seghouani@esi.dz</span>
          </div>
          <div className="flex items-center">
            <Mail className="text-[#202124] mr-2 h-5 w-5" />
            <span className="text-[#202124] font-semibold">ni_touadi@esi.dz</span>
          </div>
          <div className="flex items-center">
            <Mail className="text-[#202124] mr-2 h-5 w-5" />
            <span className="text-[#202124] font-semibold">nk_sellami@esi.dz</span>
          </div>
          <div className="flex items-center">
            <Mail className="text-[#202124] mr-2 h-5 w-5" />
            <span className="text-[#202124] font-semibold">na_lourachi@esi.dz</span>
          </div>
          <div className="flex items-center">
            <Mail className="text-[#202124] mr-2 h-5 w-5" />
            <span className="text-[#202124] font-semibold">nm_bekoul@esi.dz</span>
          </div>
          <div className="flex items-center">
            <Mail className="text-[#202124] mr-2 h-5 w-5" />
            <span className="text-[#202124] font-semibold">nm_djabri@esi.dz</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
