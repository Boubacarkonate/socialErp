# Social ERP

Social ERP est une application web de gestion interne destinée aux petites équipes. Elle centralise la gestion des utilisateurs, des produits, des commandes et du planning au sein d'une interface unifiée et sécurisée.

---

## A quoi sert cette application

L'application permet à une organisation de gérer ses membres, son catalogue de produits et son planning d'équipe depuis un seul endroit. Elle distingue trois niveaux d'accès — administrateur, équipe et utilisateur — chacun avec ses propres permissions et son propre espace de travail.

---

## Ce que l'on peut faire

### En tant qu'administrateur

- Consulter un tableau de bord avec les statistiques en temps réel : nombre d'utilisateurs inscrits, nombre de produits, unités en stock et événements planifiés.
- Gérer tous les utilisateurs : voir la liste des membres, modifier leurs informations, changer leur rôle (admin / équipe / utilisateur) ou supprimer leur compte.
- Gérer le catalogue produits : créer, modifier ou supprimer des produits avec nom, description, image, prix et stock.
- Visualiser l'évolution du stock sous forme de graphique.
- Gérer le planning de l'équipe : créer des événements avec titre, dates de début et de fin, et les attribuer à un membre.
- Consulter et modifier son propre profil.

### En tant que membre de l'équipe

- Accéder à un espace dédié avec le planning de l'équipe en lecture.
- Créer des produits et modifier ceux qui lui sont assignés.
- Consulter et modifier son propre profil.

### En tant qu'utilisateur

- Parcourir le catalogue de produits et effectuer des achats via Stripe.
- Consulter son historique de commandes avec les montants et les dates.
- Télécharger ses factures au format PDF.
- Consulter et modifier son propre profil.

---

## Technologies utilisées

| Technologie | Usage |
|---|---|
| Next.js 15 (App Router) | Framework principal, rendu serveur et client |
| TypeScript | Typage statique |
| Tailwind CSS + DaisyUI | Design system et styles |
| Clerk | Authentification et gestion des sessions |
| Prisma | ORM pour interagir avec la base de données |
| PostgreSQL | Base de données relationnelle |
| Stripe | Paiements en ligne |
| FullCalendar | Affichage du planning interactif |
| Chart.js | Graphique d'évolution du stock |
| jsPDF | Génération de factures PDF |

---

## Structure des rôles

```
admin   -> acces complet : utilisateurs, produits, planning, tableaux de bord
team    -> acces partiel : produits (création/édition), planning (lecture), profil
user    -> acces client  : catalogue, achat, historique, factures, profil
```

---

## Installation et démarrage

### Prérequis

- Node.js 18 ou supérieur
- Une base de données PostgreSQL
- Un compte Clerk (authentification)
- Un compte Stripe (paiements)

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Lancer le projet

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

---

## Déploiement

Le projet est configuré pour Vercel. La commande de build Vercel inclut la génération du client Prisma :

```bash
prisma generate && next build
```

---

## Comptes de test

| Role | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@test.com | Test1234! |
| Equipe | team@test.com | Test1234! |
| Utilisateur | user@test.com | Test1234! |
