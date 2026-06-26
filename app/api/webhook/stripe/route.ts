import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const productId = session.metadata?.productId;
    const quantity = session.metadata?.quantity;

    if (userId && productId && quantity) {
      try {
        const product = await prisma.product.findUnique({
          where: { id: parseInt(productId, 10) },
        });

        if (product) {
          await prisma.order.create({
            data: {
              userId: parseInt(userId, 10),
              productId: parseInt(productId, 10),
              quantity: parseInt(quantity, 10),
              totalPrice: product.price * parseInt(quantity, 10),
            },
          });

          // Decrement stock
          await prisma.product.update({
            where: { id: product.id },
            data: { stock: { decrement: parseInt(quantity, 10) } },
          });
        }
      } catch (error) {
        console.error("Error processing checkout.session.completed:", error);
        return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
