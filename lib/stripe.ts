import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const STRIPE_KEY_SECRET = process.env.STRIPE_KEY_SECRET;

if (!STRIPE_KEY_SECRET) {
    throw new Error("La clé secrète Stripe (STRIPE_KEY_SECRET) n'est pas définie dans le fichier .env");
}

export const stripe = new Stripe(STRIPE_KEY_SECRET, {
    typescript: true,
});

console.log("Stripe configuré avec succès !");
