import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Définir les routes publiques (pas besoin d'être connecté)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// Définir les routes protégées (nécessitent une connexion)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// Définir les routes réservées aux administrateurs
// const isAdminRoute = createRouteMatcher(['/admin(.*)']);

const isTeamRoute = createRouteMatcher(['/team(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 1. Gérer les routes publiques (accessible sans authentification)
  if (isPublicRoute(req)) {
    return; // Autorise l'accès sans authentification
  }

  // 2. Gérer les routes protégées générales (ex. : /dashboard)
  if (isProtectedRoute(req)) {
    await auth.protect(); // Bloque les utilisateurs non connectés
    return;
  }

  // 3. Gérer les routes réservées aux administrateurs (ex. : /admin)
  // if (isAdminRoute(req)) {
  //   // sessionClaims : Contient les métadonnées publiques (publicMetadata) que vous avez ajoutées à l'utilisateur lors de l'inscription ou de la gestion de leurs données (ex. : le rôle).
  //   const { userId, sessionClaims } = await auth.protect();

  //   const userRole = sessionClaims?.publicMetadata?.role;
  //   if (userRole !== 'admin') {
  //     return new Response('Accès interdit : Vous devez être administrateur pour accéder à cette page.', {
  //       status: 403, // Forbidden
  //     });
  //   }
  //   return;
  // }

  // if (isTeamRoute(req)) {
  //   // sessionClaims : Contient les métadonnées publiques (publicMetadata) que vous avez ajoutées à l'utilisateur lors de l'inscription ou de la gestion de leurs données (ex. : le rôle).
  //   const { userId, sessionClaims } = await auth.protect();

  //   const userRole = sessionClaims?.publicMetadata?.role;
  //   if (userRole !== 'team') {
  //     return new Response('Accès interdit : Vous devez être team pour accéder à cette page.', {
  //       status: 403, // Forbidden
  //     });
  //   }
  //   return;
  // }

  // 4. Par défaut, protéger toutes les autres routes
//   await auth.protect();
});

export const config = {
  matcher: [
    // Exclure les fichiers statiques et internes de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Appliquer le middleware à toutes les API
    '/(api|trpc)(.*)',
  ],
};


//le middleware en next.js est une fonction qui s'exécute avant avant que la requete atteigne les routes ou les api. 
//cela donne le pouvoir de modifier la requête, de rediriger l'utilisateur, ou même de restreindre l'accès en fonction de certaines conditions.

/*
Un middleware peut être utilisé pour :
-Vérifier si un utilisateur est connecté avant de lui permettre d'accéder à une page protégée.
-Rediriger les utilisateurs vers une autre page (par exemple, selon leur langue ou leur région, son rôle).
-Ajouter des en-têtes (headers) à une requête ou une réponse.
-Appliquer des règles globales à toutes les pages de ton application.

--------------------------------------------------

-clerkMiddleware : Un utilitaire fourni par Clerk pour intégrer la gestion d'authentification à Next.js. Il permet d'exécuter une logique personnalisée avant que les requêtes atteignent les pages ou les API.

-createRouteMatcher : Une fonction qui aide à définir les routes publiques (accessibles sans authentification).

*/