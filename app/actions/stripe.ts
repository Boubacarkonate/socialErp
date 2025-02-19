'use server';

import { PrismaClient } from "@prisma/client";
import { stripe } from "../../lib/stripe";

const prisma = new PrismaClient();

interface DataStripe {
  title: string;
  price: number;
  userId: string;
}

export async function paymentStripe(data: DataStripe) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // 1. Validation des entrées
    if (!data.title || !data.price || !data.userId) {
      throw new Error("Les données fournies sont incomplètes. Veuillez vérifier les champs.");
    }

    // 2. Récupération des informations utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkUserId: data.userId },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé dans la base de données.");
    }

    // 3. Création d'un client Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstname} ${user.lastname}`,
    });

    // 4. Validation et calcul du montant
    const amountInCentimes = Math.round(data.price * 100);
    if (amountInCentimes < 50) {
      throw new Error("Le montant total doit être supérieur à 50 centimes.");
    }

    // 5. Création de la session Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      mode: "payment",
      success_url: `${baseUrl}/success?token=${customer.id}`,
      cancel_url: `${baseUrl}/cancel?token=${customer.id}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: data.title,
            },
            currency: "EUR",
            unit_amount: amountInCentimes,
          },
        },
      ],
    });

    console.log("Session Stripe créée avec succès :", checkoutSession.id);

    // 6. Retourner l'URL de redirection
    return { message: "Session créée avec succès", url: checkoutSession.url };
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Erreur lors de la création de la session Stripe :", error.message);
        throw new Error(`Erreur Stripe : ${error.message}`);
    } else {
        console.error("Erreur inconnue lors de la création de la session Stripe :", error);
        throw new Error("Erreur Stripe inconnue");
    }
}
}
