'use server'

import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { logActivity } from "./activityLog";

const prisma = new PrismaClient();

const productSelect = {
    id: true,
    name: true,
    description: true,
    image: true,
    images: true,
    price: true,
    stock: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
    categoryId: true,
    category: { select: { id: true, name: true } },
};

export const getAllProducts = unstable_cache(
    async () => {
        try {
            return await prisma.product.findMany({ select: productSelect });
        } catch (error) {
            console.error("erreur dans la récupération de la liste des produits", error);
            throw new Error("Erreur interne du serveur.");
        }
    },
    ["all-products"],
    { revalidate: 30 }
);

export const getOneProduct = async (id: number) => {
    try {
        return await prisma.product.findUnique({
            where: { id },
            select: productSelect,
        });
    } catch (error) {
        console.error("erreur dans la récupération des données du produit", error);
        return null;
    }
};

export const getSimilarProducts = async (categoryId: number, excludeId: number) => {
    try {
        return await prisma.product.findMany({
            where: { categoryId, id: { not: excludeId }, stock: { gt: 0 } },
            select: productSelect,
            take: 3,
        });
    } catch (error) {
        console.error("erreur produits similaires", error);
        return [];
    }
};

export const upsertProduct = async (formData: FormData) => {
    const id = formData.get("id") ? parseInt(formData.get("id")?.toString() || "0", 10) : undefined;
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const image = formData.get("image")?.toString();
    const imagesRaw = formData.get("images")?.toString();
    const images = imagesRaw ? imagesRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const stock = parseInt(formData.get("stock")?.toString() || "0", 10);
    const userId = parseInt(formData.get("userId")?.toString() || "0", 10);
    const categoryIdRaw = formData.get("categoryId")?.toString();
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : undefined;

    try {
        const product = await prisma.product.upsert({
            where: { id: id || 0 },
            update: { name, description, image, images, price, stock, userId, categoryId: categoryId ?? null },
            create: { name: name ?? '', description, image, images, price, stock, userId, categoryId: categoryId ?? null },
        });
        await logActivity(
            id ? 'Produit modifié' : 'Produit créé',
            'product',
            'system',
            name
        );
        return product;
    } catch (error) {
        console.error("Erreur lors de la création ou de la modification du produit", error);
        throw new Error("Erreur interne du serveur.");
    }
};

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') ? parseFloat(formData.get('price') as string) : 0;
    const image = formData.get("image")?.toString();
    const stock = parseInt(formData.get("stock")?.toString() || "0", 10);
    const product = await prisma.product.create({
        data: { name, description, image, price, stock },
    });
    return product;
}

export const deleteProduct = async (id: number) => {
    try {
        return await prisma.product.delete({ where: { id } });
    } catch (error) {
        console.error("Erreur lors de la suppression du produit", error);
        throw new Error("Erreur interne du serveur.");
    }
};
