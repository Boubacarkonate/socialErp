import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import FormUserProfile from "../components/FormUserProfile";
import Header from "../components/hearder/Header";
import Historique from "../components/Historique";

const DashboardUser = async () => {
  const { userId } = await authentification_data();
  const userData = await getUserDetails(userId);
  console.log("user", userData);

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="page-title">Mon espace</h1>
          <p className="text-surface-400 text-sm mt-1">Gérez votre profil et consultez votre historique d&apos;achats.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="shrink-0">
            <FormUserProfile />
          </div>
          <div className="flex-1 card p-6 min-w-0">
            <Historique />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
