import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import { Calendar, Package, ShieldAlert } from "lucide-react";
import FormUserProfile from "../components/FormUserProfile";
import Planning from "../components/Planning";

const statCards = [
  { label: "Produits", icon: Package,  color: "text-accent-400", bg: "bg-accent-500/10 border-accent-500/20" },
  { label: "Planning", icon: Calendar, color: "text-brand-400",  bg: "bg-brand-500/10 border-brand-500/20" },
];

async function TeamPage() {
  const { userId } = await authentification_data();
  const userData = await getUserDetails(userId);

  if (userData?.role !== "team") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 px-6 text-center">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4">
          <ShieldAlert size={24} className="text-red-400" />
        </div>
        <h2 className="text-white font-bold text-lg">Accès refusé</h2>
        <p className="text-surface-400 text-sm mt-2">Vous n&apos;avez pas les droits d&apos;accès nécessaires.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Welcome header */}
      <div className="px-6 pt-6 pb-4 border-b border-surface-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-surface-500 text-xs font-medium uppercase tracking-wider">Tableau de bord</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">Espace Équipe</h1>
          </div>
          <span className="badge badge-success">Équipe</span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mt-5 max-w-xs">
          {statCards.map(({ label, icon: Icon, color, bg }) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bg}`}>
              <Icon size={16} className={color} />
              <span className="text-surface-300 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-5 p-6 flex-1 min-h-0">
        {/* Left: Profile */}
        <div className="shrink-0">
          <p className="label-field mb-3">Mon profil</p>
          <FormUserProfile />
        </div>

        {/* Right: Planning */}
        <div className="flex flex-col flex-1 gap-5 min-h-0 min-w-0">
          <div className="flex-1">
            <p className="label-field mb-3">Planning de l&apos;équipe</p>
            <div className="card p-4 overflow-auto max-h-[65vh]">
              <Planning />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
