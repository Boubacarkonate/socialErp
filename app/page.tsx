'use client'

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Header from "./components/hearder/Header";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  // if (!isSignedIn) {
  //   return <div>Sign in to view this page</div>
  // }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#3b82f6,_#14b8a6)]">

      {
        user && (
          <div className="text-white">

            <Header/>
          </div>

        )
      }
   
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_#3b82f6,_#14b8a6)]">
     

       {/* Hero Section */}
      <header className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-white">Gérez votre entreprise avec efficacité 🚀</h1>
        <p className="mt-4 text-gray-100 text-lg">Une plateforme intuitive pour une gestion fluide de vos équipes et produits.</p>
      </header>
      
      {/* Instructions de connexion */}
      <div className="mt-6 p-4 bg-white shadow-lg rounded-lg text-center">
        <p className="text-xl font-semibold pb-4">Utilisez les identifiants de test :</p>
        <Link
  href="/sign-in"
  className="relative inline-flex items-center justify-center p-2 rounded-full bg-teal-500 text-white font-semibold hover:underline"
>
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
  Testez ici
</Link>
      </div>
      
      {/* Aperçu des fonctionnalités */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-semibold">📊 Dashboard</h3>
          <p className="text-gray-600">Visualisez vos statistiques en un coup d’œil.</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-semibold">🛍️ Gestion des produits</h3>
          <p className="text-gray-600">Ajoutez, modifiez et suivez vos stocks en temps réel.</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-semibold">👥 Équipe & Utilisateurs</h3>
          <p className="text-gray-600">Gérez efficacement les accès et permissions.</p>
        </div>
      </section>
      
      {/* Liens rapides */}

    </div>
    </div>
  );
}
