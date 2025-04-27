import Profil from "../assets/Profil.svg";

export default function UserProfilMail({ nom, prenom, email, imageUrl }) {
  return (
    <div className="flex items-center gap-4">
  {imageUrl ? (
    <img
      src={imageUrl}
      alt={imageUrl}
      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
    />
  ) : (
    <img src={Profil} alt="Profil" className="w-10 h-10 flex-shrink-0" />
  )}
  <div className="flex flex-col min-w-0 max-w-40">
    <h3 className="text-[#5F6368] font-medium text-sm truncate">
      {nom} {prenom}
    </h3>
    <p className="text-[#80868B] text-xs truncate">{email}</p>
  </div>
</div>
  );
}