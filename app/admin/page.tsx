import { getAllPlannings } from "@/app/actions/planning";
import { getAllProducts } from "@/app/actions/products";
import { getOneUser } from "@/app/actions/user";
import { authentification_data } from "@/hooks/autentification&data";
import { fetchUsers, getUserDetails } from "@/services/servicesUsers";
import { BarChart3, Calendar, Package, ShieldAlert, Users } from "lucide-react";
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
        <p className="text-surface-400 text-sm mt-2">Vous n&apos;avez pas les droits d&apos;accès nécessaires.</p>
      </div>
    );
  }

  const [adminUser, allUsers, allProducts, allPlannings] = await Promise.all([
    getOneUser(userId),
    fetchUsers(),
    getAllProducts(),
    getAllPlannings(),
  ]);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalStock = allProducts.reduce((sum, p) => sum + (p.stock ?? 0), 0);

  const statCards = [
    {
      label: "Utilisateurs",
      value: allUsers.length,
      icon: Users,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
      border: "border-brand-500/20",
      sub: "membres inscrits",
    },
    {
      label: "Produits",
      value: allProducts.length,
      icon: Package,
      color: "text-accent-400",
      bg: "bg-accent-500/10",
      border: "border-accent-500/20",
      sub: `${totalStock} unités en stock`,
    },
    {
      label: "Événements",
      value: allPlannings.length,
      icon: Calendar,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      sub: "planifiés",
    },
    {
      label: "Analyses",
      value: "—",
      icon: BarChart3,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      sub: "stock en temps réel",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">

      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-surface-700/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-surface-500 text-xs font-medium uppercase tracking-wider">
              {today}
            </p>
            <h1 className="text-2xl font-bold text-white mt-1">
              Bonjour, {adminUser?.firstname ?? "Admin"}
            </h1>
            <p className="text-surface-400 text-sm mt-0.5">
              Voici un aperçu de votre espace d&apos;administration.
            </p>
          </div>
          <span className="badge-brand shrink-0">Admin</span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {statCards.map(({ label, value, icon: Icon, color, bg, border, sub }) => (
            <div
              key={label}
              className={`flex flex-col gap-3 p-4 rounded-xl border ${bg} ${border}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-surface-400 text-xs font-medium">{label}</span>
                <div className={`w-7 h-7 rounded-lg ${bg} border ${border} flex items-center justify-center`}>
                  <Icon size={13} className={color} />
                </div>
              </div>
              <div>
                <p className="text-white text-2xl font-bold leading-none">{value}</p>
                <p className="text-surface-500 text-[11px] mt-1">{sub}</p>
              </div>
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

        {/* Right: Planning + Stock */}
        <div className="flex flex-col flex-1 gap-5 min-h-0 min-w-0">
          <div>
            <p className="label-field mb-3">Planning de l&apos;équipe</p>
            <div className="card p-4 overflow-auto" style={{ maxHeight: "42vh" }}>
              <Planning />
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <p className="label-field mb-3">Stock des produits</p>
            <div className="card min-h-[220px]">
              <StockProduct />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
