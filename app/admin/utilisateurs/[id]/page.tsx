import { getOneUser } from "@/app/actions/user";
import DetailFormOneUser from "@/app/components/DetailFormOneUser";
import Historique from "@/app/components/Historique";
import Planning from "@/app/components/Planning";
import { ArrowLeft, Calendar, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { id: string };
};

const roleMeta: Record<string, { label: string; badge: string; dot: string }> = {
  admin: { label: "Administrateur", badge: "badge bg-brand-500/20 text-brand-300 border border-brand-500/30", dot: "bg-brand-400" },
  team:  { label: "Équipe",         badge: "badge bg-accent-500/20 text-accent-400 border border-accent-500/30", dot: "bg-accent-400" },
  user:  { label: "Utilisateur",    badge: "badge bg-surface-600/30 text-surface-300 border border-surface-500/30", dot: "bg-surface-400" },
};

const UserDetailsPage = async ({ params }: Props) => {
  const { id } = params;
  const userData = await getOneUser(id);

  const role = roleMeta[userData.role] ?? roleMeta.user;
  const joinDate = new Date(userData.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const initials = `${userData.firstname?.[0] ?? ""}${userData.lastname?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-full">
      {/* Top bar */}
      <div className="px-6 pt-5 pb-0">
        <Link
          href="/admin/utilisateurs"
          className="inline-flex items-center gap-1.5 text-surface-500 hover:text-white text-sm font-medium transition-colors duration-150 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
          Retour à la liste
        </Link>
      </div>

      {/* Hero banner */}
      <div className="mx-6 mt-4 rounded-2xl overflow-hidden border border-surface-700/50 bg-surface-800/50">
        {/* Gradient top bar */}
        <div className="h-20 bg-gradient-to-r from-brand-900/80 via-brand-800/40 to-surface-800 relative">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Profile row */}
        <div className="px-6 pb-5">
          {/* Avatar — overlaps the banner */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              {userData.photo ? (
                <Image
                  src={userData.photo}
                  alt={`${userData.firstname} ${userData.lastname}`}
                  width={72}
                  height={72}
                  className="rounded-2xl ring-4 ring-surface-800 object-cover"
                />
              ) : (
                <div className="w-18 h-18 rounded-2xl ring-4 ring-surface-800 bg-brand-600/30 border border-brand-500/30 flex items-center justify-center w-[72px] h-[72px]">
                  <span className="text-brand-300 font-bold text-xl">{initials || "?"}</span>
                </div>
              )}
              {/* Online dot */}
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface-800 ${role.dot}`} />
            </div>

            <span className={role.badge}>{role.label}</span>
          </div>

          {/* Name + meta */}
          <h1 className="text-xl font-bold text-white leading-tight">
            {userData.firstname} {userData.lastname}
          </h1>

          {/* Meta info row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2.5">
            <span className="flex items-center gap-1.5 text-surface-400 text-xs">
              <Mail size={11} className="text-surface-500" />
              {userData.email}
            </span>
            <span className="flex items-center gap-1.5 text-surface-400 text-xs">
              <Calendar size={11} className="text-surface-500" />
              Membre depuis {joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-5 p-6 items-start">
        {/* Edit form */}
        <div className="shrink-0">
          <p className="text-surface-500 text-xs font-semibold uppercase tracking-wider mb-3">Modifier le profil</p>
          <DetailFormOneUser params={{ id }} />
        </div>

        {/* Planning / History */}
        <div className="flex-1 min-w-0">
          <p className="text-surface-500 text-xs font-semibold uppercase tracking-wider mb-3">
            {userData.role === "team" || userData.role === "admin" ? "Planning" : "Historique des achats"}
          </p>
          <div className="card p-4 overflow-auto max-h-[70vh]">
            {userData.role === "team" || userData.role === "admin" ? (
              <Planning />
            ) : (
              <Historique />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
