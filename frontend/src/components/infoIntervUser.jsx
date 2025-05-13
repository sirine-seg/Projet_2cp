//for admin and personnel who declared an intervention and technicien (s) assigned
//this should be in display intervention
//this is just an extended ver of userProfilMail which will be called by a container with title

import UserProfilMail from "./userProfilMail";

export default function InfoIntervUser({ nom, prenom, email, imageUrl }) {
  return (
    <div className="w-full mx-auto">
      <div className="relative mt-0.25rem">
        <div className="flex flex-col items-start w-full py-2 px-3 border border-white rounded-[0.5rem] bg-white">
          <UserProfilMail
            nom={nom}
            prenom={prenom}
            email={email}
            imageUrl={imageUrl}
          />
        </div>
      </div>
    </div>
  );
}
