import Profil from "../assets/Profil.svg";

export default function FiltreUserProfilMail({ nom, prenom, email, imageUrl }) {
  return (
    <div className="flex items-center gap-2">
  {imageUrl ? (
    <img
      src={imageUrl}
      alt={imageUrl}
      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
    />
  ) : (
    <img src={Profil} alt="Profil" className="w-8 h-8 flex-shrink-0" />
  )}
  <div className="flex flex-col min-w-0 w-full">
    <h3 className="text-[#5F6368] font-medium text-sm truncate">
      {nom} {prenom}
    </h3>
    <p className="text-[#80868B] text-xs truncate">{email}</p>
  </div>
</div>
  );
}
