import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import FormUserProfile from "../components/FormUserProfile";
import Planning from "../components/Planning";
import StockProduct from "../components/StockProduct";

async function AdminPage() {
  const { userId } = await authentification_data(); // Authentification utilisateur pour les données Clerk
  
  const userData = await getUserDetails(userId); // Récupération des données depuis la bdd
  console.log("admin", userData);

  return (      /*max*/ 
<div className="md:max-h-screen  md:overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700">
<div>
        {/* Zone pour la sidebar ou autre contenu */}
        
        <div className="flex items-start justify-evenly">
          {userData?.role === "admin" ? (
            <>
              {/* Conteneur flex avec justify-between pour espacer FormUser et Planning */}
              <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-20 text-gray-950 pt-1">
                <div >
                <FormUserProfile />
                </div>
  <div className="flex items-center flex-col flex-1 h-full gap-4 p-4 text-gray-50">
  {/* Planning - 50% de la hauteur avec un léger padding */}
  <div className="flex-1 m-auto  md:max-h-[45vh] bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700  p-4 rounded-badge shadow-lg overflow-auto text-amber-300">
    <Planning />
  </div>

  {/* StockProduct - 50% de la hauteur */}
  <div className="flex-1  md:max-h-[45vh] md:w-full w-[320px] bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700 text-gray-100 rounded-badge shadow-lg flex items-center overflow-x-auto overflow-y-auto object-contain">
  <StockProduct />
</div>
</div>
              </div>
            </>
          ) : (
            // Si l'utilisateur n'est pas un administrateur, affichage d'un message alternatif
            <div className="text-center text-white p-4">
              {`Vous n'avez pas les droits d'accès nécessaires.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
