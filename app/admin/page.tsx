import { getRecentOrders, getTopProducts, getTotalRevenue } from "@/app/actions/order";
import { getAllPlannings } from "@/app/actions/planning";
import { getAllProducts } from "@/app/actions/products";
import { getOneUser } from "@/app/actions/user";
import { authentification_data } from "@/hooks/autentification&data";
import { fetchUsers, getUserDetails } from "@/services/servicesUsers";
import { BarChart3, Calendar, Package, ShieldAlert, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import ExportButtons from "./ExportButtons";
import ActivityLog from "../components/ActivityLog";
import FormUserProfile from "../components/FormUserProfile";
import Planning from "../components/Planning";
import StockProduct from "../components/StockProduct";

const LOW_STOCK_THRESHOLD = 5;

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

  const [adminUser, allUsers, allProducts, allPlannings, totalRevenue, recentOrders, topProducts] =
    await Promise.all([
      getOneUser(userId),
      fetchUsers(),
      getAllProducts(),
      getAllPlannings(),
      getTotalRevenue(),
      getRecentOrders(5),
      getTopProducts(5),
    ]);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalStock = allProducts.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const lowStockProducts = allProducts.filter((p) => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD);

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
      label: "Chiffre d'affaires",
      value: `${totalRevenue.toFixed(2)} €`,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      sub: "total des commandes",
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
          <div className="flex items-center gap-3 shrink-0">
            <ExportButtons />
            <span className="badge-brand">Admin</span>
          </div>
        </div>

        {/* Alertes stock bas */}
        {lowStockProducts.length > 0 && (
          <div className="mt-4 flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
            <Package size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-xs font-semibold">
                {lowStockProducts.length} produit{lowStockProducts.length > 1 ? 's' : ''} en stock bas (≤ {LOW_STOCK_THRESHOLD} unités)
              </p>
              <p className="text-amber-400/70 text-[11px] mt-0.5">
                {lowStockProducts.map((p) => p.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {statCards.map(({ label, value, icon: Icon, color, bg, border, sub }) => (
            <div key={label} className={`flex flex-col gap-3 p-4 rounded-xl border ${bg} ${border}`}>
              <div className="flex items-center justify-between">
                <span className="text-surface-400 text-xs font-medium">{label}</span>
                <div className={`w-7 h-7 rounded-lg ${bg} border ${border} flex items-center justify-center`}>
                  <Icon size={13} className={color} />
                </div>
              </div>
              <div>
                <p className="text-white text-xl font-bold leading-none">{value}</p>
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

        {/* Right: sections */}
        <div className="flex flex-col flex-1 gap-5 min-h-0 min-w-0">

          {/* Dernières commandes + Top produits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Dernières commandes */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={13} className="text-brand-400" />
                <span className="text-white text-sm font-semibold">Dernières commandes</span>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-surface-500 text-xs py-4 text-center">Aucune commande</p>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-surface-700/40 last:border-0">
                      <div className="min-w-0">
                        <p className="text-white text-xs font-medium truncate">
                          {order.user.firstname} {order.user.lastname}
                        </p>
                        <p className="text-surface-500 text-[11px] truncate">{order.product.name}</p>
                      </div>
                      <span className="text-brand-300 text-xs font-bold shrink-0">{order.totalPrice} €</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top produits */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-accent-400" />
                <span className="text-white text-sm font-semibold">Produits les plus vendus</span>
              </div>
              {topProducts.length === 0 ? (
                <p className="text-surface-500 text-xs py-4 text-center">Aucune vente</p>
              ) : (
                <div className="space-y-2">
                  {topProducts.map(({ product, totalSold }, i) => (
                    <div key={product!.id} className="flex items-center gap-3 py-1.5 border-b border-surface-700/40 last:border-0">
                      <span className="w-5 h-5 rounded-md bg-surface-700 flex items-center justify-center text-[10px] font-bold text-surface-400 shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-white text-xs font-medium flex-1 truncate">{product!.name}</p>
                      <span className="text-accent-400 text-xs font-bold shrink-0">{totalSold} vte{totalSold > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Planning */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="label-field">Planning de l&apos;équipe</p>
              <Link href="/admin/planning" className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors">
                Voir tout →
              </Link>
            </div>
            <div className="card p-4 overflow-auto" style={{ maxHeight: "38vh" }}>
              <Planning />
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="label-field mb-3">Stock des produits</p>
              <div className="card min-h-[220px]">
                <StockProduct />
              </div>
            </div>
            <div>
              <p className="label-field mb-3">Activité récente</p>
              <ActivityLog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
