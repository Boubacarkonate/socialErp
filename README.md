# Social ERP

Social ERP est une application web de gestion interne destinée aux petites équipes éco-responsables. Elle centralise la gestion des utilisateurs, des produits, des commandes et du planning au sein d'une interface unifiée, sécurisée et moderne.

---

## A quoi sert cette application

L'application permet à une organisation de gérer ses membres, son catalogue de produits et son planning d'équipe depuis un seul endroit. Elle distingue trois niveaux d'accès — administrateur, équipe et utilisateur — chacun avec ses propres permissions et son propre espace de travail.

---

## Ce que l'on peut faire

### En tant qu'administrateur

- Consulter un tableau de bord avec les statistiques en temps réel : chiffre d'affaires total, nombre d'utilisateurs, produits et événements planifiés.
- Voir les commandes récentes et les produits les plus vendus directement sur le dashboard.
- Recevoir des alertes automatiques pour les produits en stock bas (seuil de 5 unités).
- Gérer tous les utilisateurs : liste avec recherche, filtre par rôle, pagination, modification et suppression de compte.
- Gérer le catalogue produits : créer, modifier ou supprimer des produits avec nom, description, catégorie, images multiples, prix et stock.
- Filtrer le catalogue par catégorie, trier par nom ou prix, rechercher par mot-clé.
- Visualiser l'évolution du stock sous forme de graphique interactif.
- Gérer le planning de l'équipe : créer des événements avec titre et dates, supprimer un événement en cliquant dessus.
- Consulter l'historique des actions récentes (modifications de profil, créations de produits, événements planifiés).
- Exporter la liste des utilisateurs et des commandes au format CSV.
- Consulter et modifier son propre profil, y compris la photo de profil.

### En tant que membre de l'equipe

- Accéder à un espace dédié avec le planning de l'équipe.
- Créer et modifier des produits avec gestion des images et des catégories.
- Consulter et modifier son propre profil.

### En tant qu'utilisateur

- Parcourir le catalogue de produits avec recherche, filtres par catégorie et tri.
- Voir les détails d'un produit : carrousel d'images, description, stock disponible, produits similaires.
- Effectuer des achats via Stripe (paiement sécurisé).
- Consulter ses statistiques personnelles : nombre de commandes, total dépensé, produit préféré.
- Consulter son historique de commandes avec les montants et les dates.
- Télécharger ses factures au format PDF.
- Consulter et modifier son propre profil avec upload de photo depuis son ordinateur.

### Fonctionnalites generales

- Mode clair / sombre avec basculement en un clic, persisté entre les sessions.
- Assistant virtuel intégré (chatbot) accessible depuis toutes les pages.
- Pages 404 et erreur personnalisées.
- Métadonnées Open Graph sur les fiches produits pour un meilleur partage sur les réseaux sociaux.

---

## Technologies utilisées

| Technologie | Usage |
|---|---|
| Next.js 15 (App Router) | Framework principal, rendu serveur et client |
| TypeScript | Typage statique |
| Tailwind CSS | Design system et styles |
| Clerk | Authentification et gestion des sessions |
| Prisma ORM | Interactions avec la base de données |
| PostgreSQL (Neon) | Base de données relationnelle serverless |
| Stripe | Paiements en ligne et webhook sécurisé |
| FullCalendar | Planning interactif |
| Chart.js | Graphique de stock |
| jsPDF | Génération de factures PDF |
| unstable_cache | Mise en cache des requêtes Prisma (Next.js) |

---

## Structure des roles

```
admin   -> acces complet : tableau de bord, utilisateurs, produits, planning, exports
team    -> acces partiel : produits (creation/edition), planning, profil
user    -> acces client  : catalogue, achat Stripe, historique, factures PDF, profil
```

---

## Modele de donnees

```
User        -> id, clerkUserId, firstname, lastname, email, role, photo
Product     -> id, name, description, image, images[], price, stock, categoryId
Category    -> id, name
Order       -> id, userId, productId, quantity, totalPrice
Planning    -> id, title, startDate, endDate, userId
ActivityLog -> id, action, entity, userEmail, details, createdAt
```

---

## Installation et demarrage

### Prerequis

- Node.js 18 ou superieur
- Une base de donnees PostgreSQL (ex : Neon)
- Un compte Clerk (authentification)
- Un compte Stripe (paiements)

### Variables d'environnement

Creer un fichier `.env` a la racine du projet :

```env
DATABASE_URL=postgresql://...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_KEY_SECRET=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_BASE_URL=http://localhost:3000
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

## Deploiement sur Vercel

Le projet est configure pour Vercel. Ajouter toutes les variables d'environnement dans les settings du projet Vercel, puis configurer la commande de build :

```bash
prisma generate && next build
```

Pour les webhooks Stripe en production, configurer l'endpoint dans le dashboard Stripe :

```
https://votre-domaine.vercel.app/api/webhook/stripe
```

---

## Comptes de test

| Role | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@test.com | Test1234! |
| Equipe | team@test.com | Test1234! |
| Utilisateur | user@test.com | Test1234! |

---

## Auteur

Projet realise dans le cadre d'un portfolio de developpement web fullstack.
Concu avec Next.js 15, Tailwind CSS, Prisma et Clerk.
