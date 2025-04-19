import InfoIntervUser from "./infoIntervUser";

export default function InfoIntervUserContainer({ title, users = [] }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[1rem] mb-1.5 ml-0.25rem">
          {title}
        </label>
        <div className="bg-white rounded-[0.5rem]">
          {users.map((user, index) => (
            <InfoIntervUser
              key={index}
              nom={user.nom}
              prenom={user.prenom}
              email={user.email}
              imageUrl={user.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
