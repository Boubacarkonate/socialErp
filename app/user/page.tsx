
import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import FormUserProfile from "../components/FormUserProfile";
import Historique from "../components/Historique";
import Header from "../components/hearder/Header";


const DashboardUser = async () => {
  const { userId } = await authentification_data(); // Authentification utilisateur pour les données Clerk
 
  const userData = await getUserDetails(userId); // Récupération des données depuis la bdd. Le paramètre est le clerkUserId
  console.log('admin', userData);
  
 /* bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700*/
  return (
    <div className="min-h-screen bg-gradient-to-tl from-gray-300 via-gray-50 to-gray-200">
      <Header />
      
      <div className="flex flex-col gap-20 items-center md:flex-row md:justify-evenly mt-5">
   
        <div className=" ">
          <FormUserProfile />
        </div>
        { 
    <div className=" bg-gray-100  flex flex-col justify-center items-center text-slate-900">
<Historique />



    </div>
}
    </div>
    </div>
   
  );
};

export default DashboardUser;
