import UserProfilMail from "./userProfilMail";

export default function TechnicienAssign({ nom, prenom, email, onAssign, imageUrl,buttonTitle,poste ,role }) {
    return (
      <div className="max-w-xl h-[4.5rem]">
        <div className="bg-white p-2 flex items-center justify-between gap-4">
            <UserProfilMail
            nom={nom}
            prenom={prenom}
            email={email}
            imageUrl={imageUrl}
            poste={poste}
            role={role}
            
            />
           



                
            <div>

 {/* Affichage du poste ici */}
 
 <div >
 
          <button
            onClick={onAssign}
            className="items-center justify-center gap-1 px-4 py-1 bg-white border border-[#DDD0D3] rounded-md text-sm text-[#202124] font-medium hover:bg-[#BCCDE2] transition-colors duration-200 active:bg-[#BCCDE2]">
            {buttonTitle}
          </button>

          </div>
          </div>
        </div>
      </div>
    );
  }