import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Fonction pour réquper les données Clerk de l'utilisateur actuellement connecté
export const authentification_data = async () => {
 
  const { userId } = await auth();   // appel de la fonction auth() de Clerk. Si l'utilisateur est authentifié alors on récupère son userId Clerk
  if (!userId) redirect("/");

  // appel de la fonction currentUser() pour récupérer les données de l'utilisateur actuellement connecté
  const utilisateur = await currentUser();
  //retourner les données à utiliser
  return {
    userId, //l'id Clerk sera utilisé comme paramètre à la fonction getOneUser() afin d'avoir les données de l'utilisateur
    name: utilisateur?.fullName || "Invité",
    email: utilisateur?.emailAddresses[0]?.emailAddress || "Non renseigné",
  };
};
