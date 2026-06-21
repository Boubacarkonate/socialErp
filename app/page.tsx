'use client'

import { useUser } from "@clerk/nextjs";
import { BarChart3, Package, Users } from "lucide-react";
import Link from "next/link";
import Header from "./components/hearder/Header";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard analytique",
    description: "Visualisez vos KPIs et statistiques en temps réel avec des graphiques interactifs.",
    color: "text-brand-400",
    bg: "bg-brand-500/10 border-brand-500/20",
  },
  {
    icon: Package,
    title: "Gestion des produits",
    description: "Ajoutez, modifiez et suivez l'état de vos stocks avec précision.",
    color: "text-accent-400",
    bg: "bg-accent-500/10 border-accent-500/20",
  },
  {
    icon: Users,
    title: "Gestion d'équipe",
    description: "Gérez efficacement les accès, rôles, plannings et permissions de votre équipe.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-surface-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/30 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {user && (
        <div className="relative z-10">
          <Header />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-24">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Plateforme ERP nouvelle génération
        </div>

        {/* Hero */}
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Gérez votre entreprise{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
              avec efficacité
            </span>
          </h1>
          <p className="mt-5 text-surface-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Une plateforme intuitive et moderne pour piloter vos équipes, vos produits et vos plannings en toute simplicité.
          </p>
        </header>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/sign-in"
            className="relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-brand hover:shadow-glow group"
          >
            <span className="absolute inset-0 rounded-xl bg-brand-400/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            Commencer maintenant
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-surface-500 text-sm">Accès avec identifiants de test disponibles</p>
        </div>

        {/* Feature cards */}
        <section className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`relative bg-surface-800/60 backdrop-blur-sm border rounded-2xl p-6 ${feature.bg} hover:scale-105 transition-transform duration-300`}
              >
                <div className={`w-10 h-10 rounded-lg ${feature.bg} border flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </section>

        {/* Role breakdown */}
        <section className="mt-24 w-full max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-surface-500 text-xs font-medium uppercase tracking-widest mb-2">Adapté à chaque profil</p>
            <h2 className="text-2xl font-bold text-white">Que pouvez-vous faire ?</h2>
            <p className="text-surface-400 text-sm mt-2 max-w-md mx-auto">
              Chaque utilisateur accède à un espace personnalisé selon son rôle au sein de l&apos;organisation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Admin */}
            <div className="card p-5 flex flex-col gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/25 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  <span className="text-brand-300 text-xs font-semibold">Administrateur</span>
                </div>
                <p className="text-surface-400 text-xs leading-relaxed">
                  Contrôle total sur l&apos;ensemble de la plateforme.
                </p>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Tableau de bord avec statistiques en temps réel",
                  "Gérer tous les utilisateurs et leurs rôles",
                  "Créer, modifier et supprimer des produits",
                  "Visualiser le graphique de stock",
                  "Gérer le planning de l'équipe",
                  "Modifier son propre profil",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-surface-300 text-xs">
                    <svg className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Équipe */}
            <div className="card p-5 flex flex-col gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-accent-500/15 border border-accent-500/25 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                  <span className="text-accent-400 text-xs font-semibold">Équipe</span>
                </div>
                <p className="text-surface-400 text-xs leading-relaxed">
                  Accès aux outils de travail quotidiens.
                </p>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Tableau de bord équipe",
                  "Créer et modifier des produits",
                  "Consulter le planning de l'équipe",
                  "Modifier son propre profil",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-surface-300 text-xs">
                    <svg className="w-3.5 h-3.5 text-accent-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Utilisateur */}
            <div className="card p-5 flex flex-col gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-600/30 border border-surface-500/30 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-400" />
                  <span className="text-surface-300 text-xs font-semibold">Utilisateur</span>
                </div>
                <p className="text-surface-400 text-xs leading-relaxed">
                  Espace client pour acheter et suivre ses commandes.
                </p>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Parcourir le catalogue de produits",
                  "Effectuer des achats via Stripe",
                  "Consulter l'historique des commandes",
                  "Télécharger ses factures en PDF",
                  "Modifier son propre profil",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-surface-300 text-xs">
                    <svg className="w-3.5 h-3.5 text-surface-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Trust indicators */}
        <div className="mt-16 flex items-center gap-8 text-surface-500 text-sm">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Sécurisé avec Clerk
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Paiements Stripe
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Multi-rôles
          </div>
        </div>
      </div>
    </div>
  );
}
