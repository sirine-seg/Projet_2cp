import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import Profil from "../assets/Profil.svg";
import CustomCheckbox from "./customCheckbox";
import { useNavigate } from "react-router-dom";

const UserList = ({
    nom,
    prenom,
    email,
    role,
    imageUrl,
    checked = false,
    onToggle = () => {},
    user, // <-- Assurez-vous de passer l'objet utilisateur complet
    onEditClick,
    onBlockClick,
    onUnblockClick,
    setSelectedUserId,
    setIsBlockPopupVisible,
    setIsUnblockPopupVisible,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null); // Référence pour le conteneur du menu

    const handleMoreClick = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleViewDetails = (e) => {
        e.stopPropagation();
        navigate(`/TechnicienDetails/${user.id}`);
        setIsMenuOpen(false);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEditClick(user);
        setIsMenuOpen(false);
    };

    const handleBloquer = (e) => {
        e.stopPropagation();
        onBlockClick(user.id);
        setIsMenuOpen(false);
    };

    const handleDebloquer = (e) => {
        e.stopPropagation();
        onUnblockClick(user.id);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside); // Utilisez mousedown pour une réactivité plus immédiate
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    return (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm pl-3 pr-2 sm:px-4 py-2 w-full">
            <div className="flex items-center gap-4 flex-grow overflow-hidden">

                {/* Checkbox à gauche */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}>
                    <CustomCheckbox checked={checked} color="#20599E" />
                </div>

                <div>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={imageUrl}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <img src={Profil} alt="Profil" className="w-8 h-8 flex-shrink-0" />
                    )}
                </div>

                <span className="w-[80%] sm:w-[30%] text-[#202124] overflow-hidden whitespace-nowrap">{nom} {prenom}</span>

                <span className="hidden sm:block w-[40%] text-[#202124] overflow-hidden whitespace-nowrap">{email}</span>
                <span className="hidden sm:block w-[25%] text-[#202124] overflow-hidden whitespace-nowrap">{role}</span>

            </div>
            <div className="relative flex-shrink-0">
                <button className="text-gray-500 hover:text-gray-700" onClick={handleMoreClick}>
                    <MoreVertical
                        className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                </button>
                {isMenuOpen && (
                    <div
                        ref={menuRef} // Attachez la référence ici
                        className="absolute top-6 right-0 bg-white shadow-xl rounded-lg text-black w-40 z-10 border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={handleViewDetails}
                        >
                            Voir Détails
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={handleEdit}
                        >
                            Modifier
                        </button>
                        {user?.is_blocked ? (
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={handleDebloquer}
                            >
                                Débloquer
                            </button>
                        ) : (
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={handleBloquer}
                            >
                                Bloquer
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;