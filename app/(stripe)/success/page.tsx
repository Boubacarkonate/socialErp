'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Récupération du token envoyé par Stripe (customer ID)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center">
      <h1 className="text-4xl font-bold text-green-600">Paiement réussi ! 🎉</h1>
      <p className="mt-4 text-lg text-gray-700">
        Merci pour votre achat ! Votre commande a bien été enregistrée.
      </p>
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Votre ID de client Stripe : <span className="font-mono text-gray-800">{token || 'Inconnu'}</span>
        </p>
      </div>
      <div className="mt-8">
        <Link href="/">
          <p className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500">
            Retour à l'accueil
          </p>
        </Link>
      </div>
    </div>
  );
}
