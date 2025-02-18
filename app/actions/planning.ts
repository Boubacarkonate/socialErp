'use server'

import { prisma } from "../../lib/prisma";

export const getAllPlannings = async() => {
    try {
        const allPlannings = await prisma.planning.findMany({
            select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
                userId: true
            }
        });
        return allPlannings; // Retourne même un tableau vide si aucun planning n'est trouvé
    } catch (error) {
        console.error("Erreur dans la récupération des plannings", error);
        throw new Error("Impossible de récupérer les plannings.");
      }
}

// Récupérer le planning d'un utilisateur spécifique
export const getUserPlanning = async (userId: number) => {
    try {
      const userPlanning = await prisma.planning.findMany({
        where: { userId },
        select: {
          id: true,
          startDate: true,
          endDate: true,
        },
      });
  
      if (!userPlanning || userPlanning.length === 0) {
        console.log("Aucun planning trouvé pour cet utilisateur.");
        return [];
      }
  
      return userPlanning;
    } catch (error) {
      console.error("Erreur dans la récupération des plannings d'utilisateur", error);
      throw new Error("Impossible de récupérer le planning pour cet utilisateur.");
    }
  };

// Ajouter un planning
export const addPlanning = async (formData: FormData)=>{ 
    const title = formData.get('title')?.toString() || '';
    const startDateString = formData.get('startDate')?.toString();
    const endDateString = formData.get('endDate')?.toString();
    // const userId = formData.get("userId")?.toString();
    const userId = formData.get("userId") ? parseInt(formData.get("userId")?.toString() || "0", 10) : undefined;

  
    // Validation des champs requis
    if (!startDateString || !endDateString || !userId) {
      throw new Error("Tous les champs (startDate, endDate, userId) sont obligatoires.");
    }
      // Conversion des dates
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

    try {
      const createDate = await prisma.planning.create({
        data: {
            title,
            startDate,
            endDate,
            userId
        }
      })
      return createDate; // Retourne l'événement créé ou mis à jour
    } catch (error) {
      console.error("Erreur dans la création des horaires du planning", error);
      throw new Error("Impossible de créer le planning.");
    }
  };


  // Supprimer une date de planning
export const deleteDatePlanning = async (id: number) => {
    if (!id) {
      throw new Error("ID de date sélectionné non trouvé ou invalide.");
    }
  
    try {
      const deletedDate = await prisma.planning.delete({
        where: { id },
      });
  
      return deletedDate;
    } catch (error) {
      console.error("Erreur dans la suppression de la date du planning", error);
      throw new Error("Impossible de supprimer la date du planning.");
    }
  };