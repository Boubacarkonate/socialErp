import { getUserStats } from "@/app/actions/order";
import { getOneUser } from "@/app/actions/user";
import FormUserProfile from "@/app/components/FormUserProfile";
import Header from "@/app/components/hearder/Header";
import Historique from "@/app/components/Historique";
import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import { Calendar, Package, Receipt, ShoppingBag } from "lucide-react";
import Image from "next/image";

const DashboardUser = async () => {
  const { userId } = await authentification_data();
  const userData = await getOneUser(userId);
  const { id: dbId } = await getUserDetails(userId);
  const stats = await getUserStats(dbId as number);

  const joinDate = new Date(userData.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const initials = `${userData.firstname?.[0] ?? ""}${userData.lastname?.[0] ?? ""}`.toUpperCase();

  const statCards = [
    {
      icon: ShoppingBag,
      label: "Commandes",
      value: stats.orderCount.toString(),
      desc: "achats effectués",
    },
    {
      icon: Receipt,
      label: "Total dépensé",
      value: `${stats.totalSpent.toFixed(2)} €`,
      desc: "depuis l'inscription",
    },
    {
      icon: Package,
      label: "Produit préféré",
      value: stats.favoriteProduct ?? "—",
      desc: "le plus commandé",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Hero profile banner */}
        <div className="card overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-brand-900/80 via-brand-800/40 to-surface-800 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 60%)" }} />
          </div>

          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-8 mb-3">
              <div className="relative">
                {userData.photo ? (
                  <Image
                    src={userData.photo}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="rounded-2xl ring-4 ring-surface-800 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl ring-4 ring-surface-800 bg-brand-600/30 border border-brand-500/30 flex items-center justify-center">
                    <span className="text-brand-300 font-bold text-lg">{initials || "?"}</span>
                  </div>
                )}
              </div>
              <span className="badge bg-surface-600/30 text-surface-300 border border-surface-500/30">Utilisateur</span>
            </div>

            <h1 className="text-lg font-bold text-white">
              {userData.firstname} {userData.lastname}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-surface-400 text-xs">{userData.email}</span>
              <span className="flex items-center gap-1 text-surface-500 text-xs">
                <Calendar size={10} />
                Membre depuis {joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stat cards dynamiques */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map(({ icon: Icon, label, value, desc }) => (
            <div key={label} className="card px-4 py-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-brand-400" />
                </div>
                <p className="text-surface-400 text-xs font-medium uppercase tracking-wider">{label}</p>
              </div>
              <p className="text-white font-bold text-xl leading-none truncate">{value}</p>
              <p className="text-surface-500 text-[11px]">{desc}</p>
            </div>
          ))}
        </div>

        {/* Profile + History */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="shrink-0">
            <p className="label-field mb-3">Mon profil</p>
            <FormUserProfile />
          </div>

          <div className="flex-1 card p-5 min-w-0 min-h-[340px] flex flex-col">
            <Historique />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
