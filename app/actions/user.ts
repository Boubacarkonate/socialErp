'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function upsertUser(id:number, clerkUserId: string, firstname: string, lastname: string, email: string, role:string, photo: string){

    // Validation des données
    if (!id || !clerkUserId || !email) {
      throw new Error("Tous les champs obligatoires doivent être fournis.");
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Le format de l'adresse email est invalide.");
    }
    
  try {
    const user = await prisma.user.upsert({
      where: { clerkUserId },
      update: {
        firstname,
        lastname,
        email,
        photo,
      }, 
      create: {
        id,
        clerkUserId,
        firstname,
        lastname,
        email,
        role,
        photo
      },
    })
    return user;
  } catch (error) {
    console.error("Erreur lors de la crétion ou la modification de l'utilisateur :", error);
    throw new Error("Erreur interne du serveur.");
  }
}

export async function getOneUser(clerkUserId: string) {

  if (!clerkUserId || typeof clerkUserId !== "string") {
    throw new Error("Un ID valide doit être fourni pour récupérer un utilisateur.");
  }

  try {
    const one_user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!one_user) {
      throw new Error("Utilisateur non trouvé.");
    }
    
    return one_user; // Renvoie les données de l'utilisateur
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    throw new Error("Erreur interne du serveur.");
  }
}

export async function deleteOneUser(id: number) {
  try {
    if (!id) {
      throw new Error('ID invalide : un ID doit être fourni');
    }
    const userToDelete = await prisma.user.delete( {
      where: {id}
    })
    return { success: true, message: 'Utilisateur supprimé', user: userToDelete };
  } catch (error) {
     console.error(`Erreur dans la suppression de l'utilisateur avec l'ID ${id} :`, error);
    throw new Error(`Erreur lors de la suppression de l'utilisateur avec l'ID ${id}`);
  }
}

export async function upsertUsertDATA(formData: FormData){

  //Validation du formulaire
  // const id = formData.get('id') || '';
  const clerkUserId = formData.get('clerUserId')?.toString() || '';
  const lastname = formData.get('lastname')?.toString() || '';
  const firstname = formData.get('firstname')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const photo = formData.get('photo')?.toString() || '';
  const role = formData.get('role')?.toString() || '';

  // Validation des données
  if (!clerkUserId || !email) {
    throw new Error("Tous les champs obligatoires doivent être fournis.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Le format de l'adresse email est invalide.");
  }
  
try {
  const user = await prisma.user.upsert({
    where: { clerkUserId },
    update: {
      firstname,
      lastname,
      email,
      role,
      photo,
    }, 
    create: {
      // id,  car généré automatiquement (voir model)
      clerkUserId,
      firstname,
      lastname,
      email,
      role,
      photo
    },
  })
  return user;
} catch (error) {
  console.error("Erreur lors de la crétion ou la modification de l'utilisateur :", error);
  throw new Error("Erreur interne du serveur.");
}
}


export async function deleteUser(clerkUserId: string) {
  if (typeof clerkUserId !== "string") {
    throw new Error("Un ID valide doit être fourni pour supprimer un produit.");
  }

  try {
    const productToDelete = await prisma.user.delete({
      where: {clerkUserId },
    });
    return productToDelete;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);

    if (error.code === "P2025") {
      throw new Error("Aucun utilisateur correspondant trouvé pour cet ID.");
    }

    throw new Error("Erreur interne du serveur.");
  } finally {
    await prisma.$disconnect(); // Bonne pratique pour fermer la connexion
  }
}
