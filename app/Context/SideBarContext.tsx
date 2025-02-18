'use client';

import { createContext, ReactNode, useContext, useState } from "react";

// Définir le type des valeurs du contexte
interface SideBarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Créer le contexte avec un type ou une valeur par défaut
const SideBarContext = createContext<SideBarContextType | undefined>(undefined);

// Définir le type des props du provider
interface SideBarProviderProps {
  children: ReactNode;
}

// Provider pour encapsuler l'état de la barre latérale
export function SideBarProvider({ children }: SideBarProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SideBarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SideBarContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte facilement
export function useSideBar(): SideBarContextType {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error("useSideBar must be used within a SideBarProvider");
  }
  return context;
}
