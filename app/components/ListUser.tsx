'use client';

import { fetchUsers } from "@/services/servicesUsers";
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface PropsUser {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  role: string;
  clerkUserId: string;
}

const roleBadge: Record<string, string> = {
  admin: "badge-brand",
  team:  "badge-success",
  user:  "badge bg-surface-600/30 text-surface-300 border border-surface-500/30",
};

const roleLabel: Record<string, string> = {
  admin: "Admin",
  team:  "Équipe",
  user:  "Utilisateur",
};

const PAGE_SIZE = 10;

const ListUser = () => {
  const [listUsers, setListUsers] = useState<PropsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "team" | "user">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers()
      .then(setListUsers)
      .catch((err) => console.error('Erreur chargement utilisateurs :', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const filtered = useMemo(() => {
    let list = [...listUsers];
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.firstname?.toLowerCase().includes(q) ||
          u.lastname?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [listUsers, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/25 rounded-xl flex items-center justify-center">
          <Users size={16} className="text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-none">Utilisateurs</h1>
          <p className="text-surface-500 text-xs mt-0.5">Gestion des comptes et rôles</p>
        </div>
        {!loading && (
          <span className="badge-brand ml-auto">{filtered.length} compte{filtered.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Search + filter */}
      {!loading && listUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email…"
              className="input-field pl-8 text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {(["all", "admin", "team", "user"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  roleFilter === r
                    ? "bg-brand-600 text-white border-brand-500"
                    : "bg-surface-800 text-surface-400 border-surface-700 hover:text-white hover:border-brand-500/40"
                }`}
              >
                {r === "all" ? "Tous" : roleLabel[r]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-400 text-sm">Chargement des utilisateurs...</p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-surface-800 rounded-2xl flex items-center justify-center mb-4">
            <Users size={24} className="text-surface-500" />
          </div>
          <p className="text-white font-semibold">
            {search || roleFilter !== "all" ? "Aucun résultat" : "Aucun utilisateur trouvé"}
          </p>
          {(search || roleFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setRoleFilter("all"); }}
              className="mt-3 text-brand-400 text-sm hover:text-brand-300 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* List */}
      {!loading && paginated.length > 0 && (
        <div className="card divide-y divide-surface-700/50 overflow-hidden">
          {paginated.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-700/20 transition-colors duration-150"
            >
              <div className="w-9 h-9 bg-brand-600/20 border border-brand-500/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-brand-300 text-sm font-bold uppercase">
                  {user.firstname?.[0] ?? user.email?.[0] ?? '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {user.firstname || ''} {user.lastname || ''}
                  {!user.firstname && !user.lastname && <span className="text-surface-500">Nom inconnu</span>}
                </p>
                <p className="text-surface-400 text-xs truncate mt-0.5">{user.email || 'Email inconnu'}</p>
              </div>
              <span className={roleBadge[user.role] ?? roleBadge.user}>
                {roleLabel[user.role] ?? user.role ?? 'Inconnu'}
              </span>
              <Link
                href={`/admin/utilisateurs/${user.clerkUserId}`}
                className="shrink-0 flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs font-semibold transition-colors duration-150"
              >
                Voir
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-400 hover:text-white hover:border-brand-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                p === page
                  ? "bg-brand-600 text-white border border-brand-500"
                  : "bg-surface-800 border border-surface-700 text-surface-400 hover:text-white hover:border-brand-500/40"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-400 hover:text-white hover:border-brand-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ListUser;
