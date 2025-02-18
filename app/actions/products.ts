'use server'

import { PrismaClient } from "@prisma/client";

const prisma =new PrismaClient();

export const getAllProducts = async () => {
    try {
        const list_products = await prisma.product.findMany();
        return list_products;
    } catch (error) {
        console.error("erreur dans la récupération de la liste des produits", error);
        throw new Error("Erreur interne du serveur.");
    }
}

export const getOneProduct = async (id: number) => {
    try {
        const product = await prisma.product.findUnique({
            where: {id}
        })
        return product;
    } catch (error) {
        console.error("erreur dans la récupération des données du produit", error);
        
    }
}

// export const upsertProduct = async (id: string, name: string, description: string, price: number, userId: string) => {

//     try {
//         const product = await prisma.product.upsert({
//             where: {id},
//             update: {
//                 name,
//                 description,
//                 price,
//             },
//             create: {
//                 id,
//                 name,
//                 description,
//                 price,
//                 userId
//             }
//         })
//         return product;

//     } catch (error) {
//         console.error("erreur dans la création/modification du produit", error);
//         throw new Error("Erreur interne du serveur.");
 
//     }
// }

export const upsertProduct = async (formData: FormData) => {
    const id = formData.get("id") ? parseInt(formData.get("id")?.toString() || "0", 10) : undefined;
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const image = formData.get("image")?.toString();
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const stock = parseInt(formData.get("stock")?.toString() || "0", 10);
    const userId = parseInt(formData.get("userId")?.toString() || "0", 10);
    

    try {
        const product = await prisma.product.upsert({
            where: { id: id || 0 }, // Utilisation d'une valeur arbitraire (0) pour ignorer si aucune correspondance
            update: {
                name,
                description,
                image,
                price,
                stock,
                userId
            },
            create: {
                name,
                description,
                image,
                price,
                stock,
                userId,
            }
        });
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
    // const userId = formData.get('userId') ? (formData.get('userId') as string) : null;
    const stock = parseInt(formData.get("stock")?.toString() || "0", 10);
    const product = await prisma.product.create({
        data: {
            name,
            description,
            image,
            price,
            stock,
            // userId,
        }
    });

    return product;
}

export const deleteProduct = async (id: number) => {
    try {
        const deleteToProduct = await prisma.product.delete({
            where: { id }
        });

        
        return deleteToProduct;

    } catch (error) {
        console.error("Erreur lors de la suppression du produit", error);
        throw new Error("Erreur interne du serveur.");
    }
};
