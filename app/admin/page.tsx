import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import { ShieldAlert } from "lucide-react";
import FormUserProfile from "../components/FormUserProfile";
import Planning from "../components/Planning";
import StockProduct from "../components/StockProduct";

async function AdminPage() {
  const { userId } = await authentification_data();
  const userData = await getUserDetails(userId);

  if (userData?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 px-6 text-center">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4">
          <ShieldAlert size={24} className="text-red-400" />
        </div>
        <h2 className="text-white font-bold text-lg">Accès refusé</h2>
        <p className="text-surface-400 text-sm mt-2">Vous n&apos;avez pas les droits d&apos;accès nécessaires pour cette page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-full min-h-0">
      {/* Left: Profile */}
      <div className="shrink-0">
        <FormUserProfile />
      </div>

      {/* Right: Planning + Stock */}
      <div className="flex flex-col flex-1 gap-6 min-h-0 min-w-0">
        {/* Planning */}
        <div className="card p-4 overflow-auto" style={{ maxHeight: "48vh" }}>
          <Planning />
        </div>

        {/* Stock */}
        <div className="card flex-1 overflow-auto min-h-0">
          <StockProduct />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
