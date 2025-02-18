import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import { ReactNode } from "react";
import { SideBarProvider } from "../Context/SideBarContext";
import SideBar from "../components/SideBar";
import Header from "../components/hearder/Header";


interface TeamLayoutProps {
  children: ReactNode;
}

export default async function TeamLayout({ children }: TeamLayoutProps) {
    const { userId } = await authentification_data(); // Authentification utilisateur pour les données Clerk
   
    const userData = await getUserDetails(userId); // Récupération des données depuis la bdd. Le paramètre est le clerkUserId
    
  return (
    <SideBarProvider>
      <div className="flex bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-600">
        <SideBar role={userData.role} />
        <main className="flex-1 bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-600 text-gray-50">
          
             <Header />
          
         
          {children}
          </main>
      </div>
    </SideBarProvider>
  );
}
