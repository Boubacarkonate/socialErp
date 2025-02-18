import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import FormUserProfile from "../components/FormUserProfile";
import Planning from "../components/Planning";

async function page() {
    const { userId } = await authentification_data(); // Authentification utilisateur pour les données Clerk
    
    const userData = await getUserDetails(userId); // Récupération des données depuis la bdd
    console.log("team => ", userData);
  return (
    <div className="max-h-screen overflow-hidden ">      
            <div className="flex items-start justify-evenly">
              {userData?.role === "team" ? (
                <>
                  {/* Conteneur flex avec justify-between pour espacer FormUser et Planning */}
                  <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-20 text-gray-950 pt-1">
                    <div >
                    <FormUserProfile />
                    </div>
      <div className="flex flex-col flex-1 h-full w-full gap-4 p-4 text-gray-50">
      {/* Planning - 50% de la hauteur avec un léger padding */}
      <div className="flex-1   p-4 rounded-badge shadow-lg overflow-auto text-gray-50">
        <Planning />
      </div>
    </div>
                  </div>
                </>
              ) : (
                // Si l'utilisateur n'est pas un administrateur, affichage d'un message alternatif
                <div className="text-center text-white p-4">
                  Vous n'avez pas les droits d'accès nécessaires.
                </div>
              )}
            </div>
        </div>
  )
}

export default page
