import { clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET(){
  try {
    const all_users = await prisma.user.findMany();

    return NextResponse.json(all_users, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
  }
  export async function POST(req: Request) {
    try {
      // Récupération des données du corps de la requête
      const body = await req.json();
      const { firstname, lastname, email, password, role } = body;
  
      // Création de l'utilisateur dans Clerk
      const client = await clerkClient()
      const clerkUser = await client.users.createUser({
        emailAddress: [email],  // Utilisation d'une seule adresse email, pas un tableau
        firstName: firstname,
        lastName: lastname,
        password: password,
      })
  
      // Vérification que l'utilisateur Clerk a bien été créé
      if (!clerkUser || !clerkUser.id) {
        return NextResponse.json({ error: 'Erreur lors de la création de l’utilisateur Clerk' }, { status: 422 });
      }

  
      // Création ou mise à jour de l'utilisateur dans Prisma
      const prismaUser = await prisma.user.upsert({
        where: { clerkUserId: clerkUser.id },
        update: {
          lastname: clerkUser.lastName,
          firstname: clerkUser.firstName,
          email: clerkUser.emailAddresses[0].emailAddress,
          photo: clerkUser.imageUrl,
          role,
        },
        create: {
          clerkUserId: clerkUser.id,
          lastname: clerkUser.lastName,
          firstname: clerkUser.firstName,
          email: clerkUser.emailAddresses[0].emailAddress,
          role,
          photo: clerkUser.imageUrl 
        },
      });
  
      // Retourne la réponse réussie
      return NextResponse.json({ message: 'Utilisateur créé avec succès', prismaUser }, { status: 201 });
  
    } catch (error) {
      console.error('Erreur lors de la création de l’utilisateur:', error);
  
      // Gestion des erreurs
      return NextResponse.json(
        { error: 'Erreur interne du serveur', details: error instanceof Error ? error.message : error },
        { status: 500 }
      );
    }
  }

  
  export async function POST1(req: Request) {
    try {
      const body = await req.json();
      const { lastname, firstname, email, role, password } = body

      const client = await clerkClient();
      const clerkUser = await client.users.createUser({
        emailAddress: [email],
        lastName: lastname,
        firstName: firstname,
        password: password,
      });

      if (!clerkUser) {
        return NextResponse.json({ message: "Création Clerk ivalide", clerkUser}, {status: 422})
      }
      
      const prismaUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          lastname,
          firstname,
          email,
          role,
          photo: clerkUser.imageUrl 
        }
      })
    // Retourne la réponse réussie
    return NextResponse.json({ message: 'Utilisateur créé avec succès', prismaUser }, { status: 201 });
  
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur:', error);

    // Gestion des erreurs
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
  }
  

