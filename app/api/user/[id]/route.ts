import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";


export async function DELETE(req: Request) {
  try {
    // Récupération de l'ID utilisateur à partir du corps de la requête JSON
    const { clerkUserId } = await req.json();
    const client = await clerkClient()
    await client.users.deleteUser(clerkUserId)

    // Vérification de la présence de `clerkUserId`
    if (!clerkUserId) {
      return NextResponse.json(
        { error: "L'identifiant utilisateur `clerkUserId` est requis." },
        { status: 400 }
      );
    }

    // Suppression de l'utilisateur dans Prisma
    const deleteUser = await prisma.user.delete({
      where: { clerkUserId },
    });

    // Réponse en cas de succès
    return NextResponse.json(
      { message: "Utilisateur supprimé avec succès", deleteUser },
      { status: 200 }
    );
  } catch (error) {
    // Gestion des erreurs : utilisateur introuvable ou autres erreurs
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Aucun utilisateur trouvé avec cet identifiant." },
        { status: 404 }
      );
    }

    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}


