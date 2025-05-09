import AjouterInterventionAdmin from "../interventions/ajouterintervention";
import AjouterInterventionUser from "../interventions/signalerPers";

const AjouterInterventionRedirect = ({ userRole }) => {
  if (userRole === "Administrateur") {
    return <AjouterInterventionAdmin />;
  } else {
    return <AjouterInterventionUser />;
  }
};

export default AjouterInterventionRedirect;
