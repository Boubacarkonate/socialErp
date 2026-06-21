import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import { ReactNode } from "react";
import { SideBarProvider } from "../Context/SideBarContext";
import Header from "../components/hearder/Header";
import SideBar from "../components/SideBar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { userId } = await authentification_data();
  const userData = await getUserDetails(userId);

  return (
    <SideBarProvider>
      <div className="flex h-screen bg-surface-900 overflow-hidden">
        <SideBar role={userData.role} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SideBarProvider>
  );
}
