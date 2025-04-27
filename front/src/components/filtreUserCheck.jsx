import FiltreUserProfilMail from "./filreUserProfilMail";
import CustomCheckbox from "./customCheckbox";

const FiltreUserCheck = ({ 
    technicien,
    checked = false,
    onCheck = () => {}
  }) => {
    return (
      <label
        className="flex items-center space-x-3 max-w-[220px] py-2 cursor-pointer"
        onClick={onCheck}
      >
      <CustomCheckbox checked={checked} />
      <FiltreUserProfilMail
        nom={technicien.nom}
        prenom={technicien.prenom}
        email={technicien.email}
        imageUrl={technicien.imageUrl}
      />
      </label>
    );
  };
  
  export default FiltreUserCheck;
  
