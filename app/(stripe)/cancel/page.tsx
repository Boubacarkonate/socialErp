'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center">
      <h1 className="text-4xl font-bold text-red-600">Paiement annulé ❌</h1>
      <p className="mt-4 text-lg text-gray-700">
        Votre paiement a été annulé. Vous pouvez réessayer ou continuer à parcourir notre site.
      </p>
      <div className="mt-8">
        <Link href="/">
          <p className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700">
            Retour à l'accueil
          </p>
        </Link>
      </div>
      <div className="mt-4">
        <Link href="/cart">
          <p className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500">
            Voir mon panier
          </p>
        </Link>
      </div>
    </div>
  );
}
