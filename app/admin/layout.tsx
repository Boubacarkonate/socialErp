import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import { ReactNode } from "react";
import { SideBarProvider } from "../Context/SideBarContext";
import SideBar from "../components/SideBar";
import Header from "../components/hearder/Header";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const { userId } = await authentification_data(); // Authentification utilisateur pour les données Clerk
   
    const userData = await getUserDetails(userId); // Récupération des données depuis la bdd. Le paramètre est le clerkUserId
    
  return (
    <SideBarProvider>
      <div className="flex bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700">
        <SideBar role={userData.role} />
        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700 text-amber-300">
          
             <Header />
          
         
          {children}
          </main>
      </div>
    </SideBarProvider>
  );
}
