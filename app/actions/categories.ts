'use server'

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export const getAllCategories = async () => {
    try {
        return await prisma.category.findMany({ orderBy: { name: 'asc' } });
    } catch (error) {
        console.error("Erreur récupération catégories", error);
        return [];
    }
};

export const createCategory = async (formData: FormData) => {
    const name = formData.get('name')?.toString().trim();
    if (!name) throw new Error("Le nom est obligatoire.");
    try {
        const category = await prisma.category.create({ data: { name } });
        revalidatePath('/admin/produits');
        return category;
    } catch (error) {
        console.error("Erreur création catégorie", error);
        throw new Error("Impossible de créer la catégorie.");
    }
};

export const deleteCategory = async (id: number) => {
    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/produits');
    } catch (error) {
        console.error("Erreur suppression catégorie", error);
        throw new Error("Impossible de supprimer la catégorie.");
    }
};
