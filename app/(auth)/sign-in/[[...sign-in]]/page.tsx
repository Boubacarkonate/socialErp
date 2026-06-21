import { SignIn } from '@clerk/nextjs';
import { BarChart3, Lock, Shield, Users } from 'lucide-react';

const credentials = [
  { role: 'Admin', email: 'admin@test.com', password: 'PasswordAdmin1234', color: 'text-brand-300', bg: 'bg-brand-500/10 border-brand-500/20' },
  { role: 'Team',  email: 'team@test.com',  password: 'PasswordTeam1234',  color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
  { role: 'User',  email: 'user@test.com',  password: 'PasswordUser1234',  color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
];

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-10">

        {/* Left panel */}
        <div className="flex-1 flex flex-col gap-6 w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-brand">
              <BarChart3 size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">Social ERP</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white leading-tight">
              Bienvenue
            </h1>
            <p className="text-surface-400 text-sm mt-1">
              Connectez-vous pour accéder à votre espace de travail.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            {[
              { icon: Shield,    label: 'Accès sécurisé multi-rôles' },
              { icon: Users,     label: 'Gestion d\'équipe centralisée' },
              { icon: Lock,      label: 'Authentification Clerk' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-surface-400 text-sm">
                <div className="w-7 h-7 bg-surface-800 border border-surface-700 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-brand-400" />
                </div>
                {label}
              </div>
            ))}
          </div>

          {/* Test credentials */}
          <div className="card p-4 space-y-3">
            <p className="text-surface-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={10} />
              Identifiants de test
            </p>
            {credentials.map(({ role, email, password, color, bg }) => (
              <div key={role} className={`border rounded-xl px-3 py-2.5 ${bg}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${color}`}>{role}</p>
                <p className="text-surface-300 text-xs font-mono">{email}</p>
                <p className="text-surface-500 text-xs font-mono">{password}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Clerk SignIn */}
        <div className="shrink-0">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
