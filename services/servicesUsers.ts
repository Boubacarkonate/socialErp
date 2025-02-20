import { getOneUser } from "@/app/actions/user";
import dotenv from 'dotenv';


dotenv.config();

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  
  // Fonction pour récupérer les utilisateurs de l'API route user
 export const fetchUsers = async (): Promise<User[]> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(apiUrl, {
      next: { revalidate: 10 }, 
      });
      if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Fonction pour récupérer les données de la bdd. Elle aura comme futur paramètre l'id de Clerk
  export const getUserDetails = async (id_clerk: string) => {
    try {
      //appel de l'action server pour récupérer les données de l'utilisateur
      const dataUser = await getOneUser(id_clerk);

      return {
        id: dataUser?.id || "Non renseigné",
        role: dataUser?.role || "Non renseigné",
        // photo: dataUser?.photo || "Non renseigné",
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
      throw error;
    }
  };
