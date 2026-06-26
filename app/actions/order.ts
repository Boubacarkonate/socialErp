'use server'

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserStats = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { product: true },
  });

  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const orderCount = orders.length;

  // Produit préféré = le plus commandé
  const productCount: Record<number, { name: string; count: number }> = {};
  for (const o of orders) {
    if (!productCount[o.productId]) {
      productCount[o.productId] = { name: o.product.name, count: 0 };
    }
    productCount[o.productId].count += o.quantity;
  }
  const favorite = Object.values(productCount).sort((a, b) => b.count - a.count)[0] ?? null;

  return { totalSpent, orderCount, favoriteProduct: favorite?.name ?? null };
};

export const getTotalRevenue = async (): Promise<number> => {
  const result = await prisma.order.aggregate({ _sum: { totalPrice: true } });
  return result._sum.totalPrice ?? 0;
};

export const getRecentOrders = async (limit = 5) => {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { user: true, product: true },
  });
};

export const getTopProducts = async (limit = 5) => {
  const grouped = await prisma.order.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: limit,
  });

  const products = await Promise.all(
    grouped.map(async (g) => {
      const product = await prisma.product.findUnique({ where: { id: g.productId } });
      return { product, totalSold: g._sum.quantity ?? 0 };
    })
  );
  return products.filter((p) => p.product !== null);
};

//CREER UNE COMMANDE
export const createOrder = async (quantity: number, totalPrice: number, userId: number, productId: number) => {
    if (quantity < 0 || !userId || !productId) {
        throw new Error( 'champs invalide pour la commande');
    };

  try {
    const newOrder = await prisma.order.create({
        data: {
            quantity,
            totalPrice,
            userId,
            productId
        }
    });
    return newOrder;
  } catch (error) {
    console.error("erreur dans la création de la commande", error);
  }
};

//RECUPERER LES COMMANDES D'UN UTILISATEUR
export const getOrder_user = async (id: number) => {

    try {
       const order_user = await prisma.user.findUnique({
        where: {id},
        include: {orders: true}
       })
       return order_user;
    } catch (error) {
        console.error("erreur dans la création de la commande", error);
  
    }
}



//LISTER LES PRODUITS COMMANDES PAR UN UTILISATEUR
export const productsByUser = async (id: number) => { //La fonction prend en paramètre id, un identifiant utilisateur de type chaîne de caractères.
    try {
        const orders = await prisma.order.findMany({
            where: {userId: id},  //Filtre les enregistrements dans la table order pour ne récupérer que ceux où userId correspond à l'ID utilisateur passé en paramètre.
            include: {product: true} //Spécifie que les détails des produits associés à chaque commande doivent être inclus.
        })
        return orders;
    } catch (error) {
        console.error("erreur dans la récupération de toutes les commandes de l'utilisateur", error);
    }
}


export const createBuy = async (userId: number, productId: number, quantity: number) => {
    if (!userId || !productId || !quantity || quantity <= 0) {
        throw new Error("Champs invalides ou quantité nulle ou inférieure à zéro");
      }
    
    try {
        const productToBuy = await prisma.product.findUnique({
            where: { id: productId },
        });
        console.log('1 ---> Produit trouvé :', productToBuy);

        if (!productToBuy) {
            throw new Error("Produit non trouvé");
        }

        if (productToBuy.stock < quantity) {
            console.log(`Le stock du produit ${productToBuy.name} est insuffisant`);
            throw new Error("Stock insuffisant");
        }

        const totalPrice = productToBuy.price * quantity;
        console.log('2 ---> Prix total calculé :', totalPrice);

        const orderCreated = await prisma.order.create({
            data: {
                userId,
                productId,
                quantity,
                totalPrice
            },
            include: {
                user: true,
                product: true
            }
        });
        console.log('Commande créée :', orderCreated);

        await prisma.product.update({
            where: { id: productId },
            data: { stock: productToBuy.stock - quantity }
        });
        console.log('3 ---> Stock restant après mise à jour :', productToBuy.stock - quantity);

        // await prisma.product.update({
        //     where: { id: productId},
        //     data: { userId}
        // })
            // await prisma.product.create({
            //     data: { userId: userId}
            // })

        return orderCreated;
    } catch (error) {
        console.error("L'achat n'a pas pu être exécuté", error);
        throw new Error("Une erreur s'est produite lors de la création de la commande");
    }
};
