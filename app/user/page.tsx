import { getOneUser } from "@/app/actions/user";
import FormUserProfile from "@/app/components/FormUserProfile";
import Header from "@/app/components/hearder/Header";
import Historique from "@/app/components/Historique";
import { authentification_data } from "@/hooks/autentification&data";
import { Calendar, Receipt, ShoppingBag, User } from "lucide-react";
import Image from "next/image";

const DashboardUser = async () => {
  const { userId } = await authentification_data();
  const userData = await getOneUser(userId);

  const joinDate = new Date(userData.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const initials = `${userData.firstname?.[0] ?? ""}${userData.lastname?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Hero profile banner */}
        <div className="card overflow-hidden">
          {/* Gradient bar */}
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

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: User,        label: "Profil",    desc: "Informations personnelles" },
            { icon: ShoppingBag, label: "Achats",    desc: "Historique des commandes" },
            { icon: Receipt,     label: "Factures",  desc: "Documents téléchargeables" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Icon size={14} className="text-brand-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold leading-none">{label}</p>
                <p className="text-surface-500 text-[11px] mt-0.5 truncate">{desc}</p>
              </div>
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
