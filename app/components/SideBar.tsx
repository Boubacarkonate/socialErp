'use client';

import { useSideBar } from "../Context/SideBarContext";

export default function SideBar({ role }) {
  const { isOpen, toggleSidebar } = useSideBar();

  const menuItemsAdmin = [
    { name: "Accueil", icon: "🏠", link: "/admin" },
    { name: "Gestion des utilisateurs", icon: "👤", link: "/admin/utilisateurs" },
    { name: "Gestion des produits", icon: "📦", link: "/admin/produits" },
    { name: "Gestion de l'équipe", icon: "🗓️", link: "/admin/planning" },
    // { name: "Paramètres", icon: "⚙️", link: "/settings" },
  ];

  const menuItemsTeam = [
    { name: "Accueil", icon: "🏠", link: "/team" },
    { name: "Gestion des produits", icon: "📦", link: "/team/produits" },
    { name: "Voir le planning", icon: "🗓️", link: "/team/planning" },
    // { name: "Paramètres", icon: "⚙️", link: "/settings" },
  ];

  const menuItems = role === "admin" ? menuItemsAdmin : menuItemsTeam;

  return (
    <>
      {/* Bouton Hamburger (visible uniquement sur mobile) */}
      <button
        onClick={toggleSidebar}
        className="p-2 bg-gray-50 text-gray-900 opacity-15 hover:text-gray-700 hover:bg-gray-50 hover:opacity-100 rounded-full fixed top-10 left-4 z-50 md:hidden"
      >
        ☰
      </button>

      {/* Sidebar pour les grands écrans */}
      <div className="hidden md:flex bg-gray-800 h-screen w-64 flex-col p-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="flex items-center gap-4 p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </a>
        ))}
      </div>

      {/* Modal Sidebar pour mobiles */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay noir semi-transparent */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={toggleSidebar} // Ferme la sidebar si on clique en dehors
          ></div>

          {/* Sidebar Modal */}
          <div className="bg-gray-800 w-64 h-full p-4 flex flex-col shadow-lg relative">
            {/* Bouton de fermeture */}
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✖
            </button>

            {/* Menu */}
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="flex items-center gap-4 p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
