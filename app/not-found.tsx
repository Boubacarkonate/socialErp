import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">Erreur 404</p>
        <h1 className="text-6xl font-extrabold text-white mb-4">Oups.</h1>
        <p className="text-surface-400 text-base leading-relaxed mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-brand"
        >
          Retour à l&apos;accueil
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
