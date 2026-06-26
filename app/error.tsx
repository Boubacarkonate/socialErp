'use client';

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Une erreur est survenue</h1>
        <p className="text-surface-400 text-sm leading-relaxed mb-6">
          Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir à l&apos;accueil.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm transition-all duration-200"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="px-5 py-2.5 bg-surface-700 hover:bg-surface-600 text-surface-300 hover:text-white font-semibold rounded-xl text-sm transition-all duration-200"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}
