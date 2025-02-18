


import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";

const prisma = new PrismaClient();

interface DataStripe {
  title: string;
  price: number;
  userId: string;
}



export async function POST(req: Request) {
  // //gestion des URLs dynamiques basées sur l'environnement (production ou développement). A ajouter au .env
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const data: DataStripe = await req.json();
    console.log("Données reçues :", data);

    // Validation des données
    if (!data.title || !data.price || !data.userId) {
      throw new Error("Données manquantes pour créer une session Stripe");
    }

    // Récupération des informations utilisateur depuis Prisma
    const user = await prisma.user.findUnique({
      where: { clerkUserId: data.userId },
    });
    console.log("Utilisateur trouvé :", user);

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé pour l'achat Stripe" },
        { status: 404 }
      );
    }

    // Création d'un client Stripe avec les données utilisateur
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstname} ${user.lastname}`,
    });

    // Calcul du montant en centimes
    const amountInCentimes = Math.round(data.price * 100);

    if (amountInCentimes < 50) {
      throw new Error("Le prix doit être supérieur à 50 centimes");
    }

    // Création d'une session Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      mode: 'payment',
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

    console.log("Session Stripe créée :", checkoutSession);
    console.log("Session Stripe URL :", checkoutSession.url);

    // Retourner l'URL de redirection vers la session de paiement
    return NextResponse.json(
      { message: "Session créée avec succès", url: checkoutSession.url },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Erreur => ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};






export async function GET(){
  try {
    const all_users = await prisma.user.findMany();

    return NextResponse.json(all_users, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
  }
