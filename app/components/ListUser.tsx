'use client';

import { fetchUsers } from "@/services/servicesUsers";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PropsUser {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  role: string;
  clerkUserId: string;
};

const ListUser = () => {
  const [listUsers, setListUsers] = useState<PropsUser[]>([]);

  useEffect(() => {
    try {
      const loadUsers = async () => {
        const list = await fetchUsers();
        setListUsers(list);
      };
      loadUsers();
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs : ', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700 flex flex-col items-center py-6 px-4 sm:py-10 sm:px-6">
      
      <h1 className="text-2xl sm:text-4xl font-bold text-amber-300 mb-3 sm:mb-4 drop-shadow-lg text-center">
        Liste des Utilisateurs
      </h1>
      <div className="w-full max-w-2xl sm:max-w-4xl bg-amber-100 shadow-xl rounded-lg p-4 sm:p-6 border-2 border-amber-300">
        <ul className="space-y-3 sm:space-y-4">
          {listUsers.map((element) => (
            <li
              key={element.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-amber-200 p-3 sm:p-4 rounded-md shadow-md border border-amber-300 hover:bg-amber-300 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <div className="text-base sm:text-lg font-semibold text-gray-900">
                  {element.firstname || "Prénom inconnu"} {element.lastname || "Nom inconnu"}
                </div>
                <span className="text-gray-700 text-xs sm:text-sm italic">
                  {element.email || "Email inconnu"}
                </span>
                <span
                  className={`mt-2 sm:mt-0 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md self-start sm:self-auto ${
                    element.role === "admin"
                      ? "bg-green-200 text-green-700 border border-green-400"
                      : element.role === "team"
                      ? "bg-blue-200 text-blue-700 border border-blue-400"
                      : "bg-gray-200 text-gray-700 border border-gray-400"
                  }`}
                >
                  {element.role || "Rôle inconnu"}
                </span>
              </div>
              <Link
                href={`/admin/utilisateurs/${element.clerkUserId}`}
                className="mt-2 sm:mt-0 text-teal-700 hover:text-teal-500 font-semibold transition-all duration-200 text-sm sm:text-base"
              >
                Voir Profil →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListUser;
