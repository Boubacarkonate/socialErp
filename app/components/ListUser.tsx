'use client';

import { fetchUsers } from "@/services/servicesUsers";
import { Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const ListUser = () => {
  const [listUsers, setListUsers] = useState<PropsUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const list = await fetchUsers();
        setListUsers(list);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/25 rounded-xl flex items-center justify-center">
          <Users size={16} className="text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-none">Utilisateurs</h1>
          <p className="text-surface-500 text-xs mt-0.5">Gestion des comptes et rôles</p>
        </div>
        {!loading && (
          <span className="badge-brand ml-auto">{listUsers.length} compte{listUsers.length > 1 ? 's' : ''}</span>
        )}
      </div>

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
      {!loading && listUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-surface-800 rounded-2xl flex items-center justify-center mb-4">
            <Users size={24} className="text-surface-500" />
          </div>
          <p className="text-white font-semibold">Aucun utilisateur trouvé</p>
        </div>
      )}

      {/* List */}
      {!loading && listUsers.length > 0 && (
        <div className="card divide-y divide-surface-700/50 overflow-hidden">
          {listUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-700/20 transition-colors duration-150"
            >
              {/* Avatar placeholder */}
              <div className="w-9 h-9 bg-brand-600/20 border border-brand-500/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-brand-300 text-sm font-bold uppercase">
                  {(user.firstname?.[0] ?? user.email?.[0] ?? '?')}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {user.firstname || ''} {user.lastname || ''}
                  {!user.firstname && !user.lastname && <span className="text-surface-500">Nom inconnu</span>}
                </p>
                <p className="text-surface-400 text-xs truncate mt-0.5">{user.email || 'Email inconnu'}</p>
              </div>

              {/* Role badge */}
              <span className={roleBadge[user.role] ?? roleBadge.user}>
                {roleLabel[user.role] ?? user.role ?? 'Inconnu'}
              </span>

              {/* Link */}
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
    </div>
  );
};

export default ListUser;
