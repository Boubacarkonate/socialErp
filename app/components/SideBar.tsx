'use client';

import { BarChart3, Calendar, Home, Package, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSideBar } from "../Context/SideBarContext";

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  link: string;
}

const menuItemsAdmin: MenuItem[] = [
  { name: "Accueil", icon: Home, link: "/admin" },
  { name: "Utilisateurs", icon: Users, link: "/admin/utilisateurs" },
  { name: "Produits", icon: Package, link: "/admin/produits" },
  { name: "Planning", icon: Calendar, link: "/admin/planning" },
];

const menuItemsTeam: MenuItem[] = [
  { name: "Accueil", icon: Home, link: "/team" },
  { name: "Produits", icon: Package, link: "/team/produits" },
  { name: "Planning", icon: Calendar, link: "/team/planning" },
];

function NavItem({ item, onClick }: { item: MenuItem; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.link;
  const Icon = item.icon;

  return (
    <Link
      href={item.link}
      onClick={onClick}
      className={isActive ? "sidebar-link-active" : "sidebar-link"}
    >
      <Icon size={16} className={isActive ? "text-brand-400" : "text-current"} />
      <span>{item.name}</span>
    </Link>
  );
}

function SidebarContent({ items, onClose }: { items: MenuItem[]; onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-surface-700/50 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center shadow-brand">
            <BarChart3 size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm">Social ERP</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-surface-700 hover:bg-surface-600 text-surface-400 hover:text-white rounded-lg transition-all duration-150"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="text-surface-600 text-[10px] font-semibold uppercase tracking-widest px-3 py-2">Navigation</p>
        {items.map((item) => (
          <NavItem key={item.link} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-surface-700/50">
        <div className="px-3 py-2 rounded-lg bg-brand-500/5 border border-brand-500/10">
          <p className="text-surface-500 text-[11px]">Social ERP</p>
          <p className="text-surface-600 text-[10px]">v0.1.0</p>
        </div>
      </div>
    </div>
  );
}

export default function SideBar({ role }: { role: string }) {
  const { isOpen, toggleSidebar } = useSideBar();
  const menuItems = role === "admin" ? menuItemsAdmin : menuItemsTeam;

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 w-8 h-8 flex items-center justify-center bg-surface-800/80 backdrop-blur border border-surface-700 text-surface-400 hover:text-white rounded-lg transition-all duration-150 md:hidden"
        aria-label="Menu"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 2h12M1 7h12M1 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-surface-950 border-r border-surface-700/50 h-full">
        <SidebarContent items={menuItems} />
      </aside>

      {/* Mobile modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleSidebar}
          />
          <aside className="relative w-56 bg-surface-950 border-r border-surface-700/50 h-full animate-slide-in shadow-2xl">
            <SidebarContent items={menuItems} onClose={toggleSidebar} />
          </aside>
        </div>
      )}
    </>
  );
}
