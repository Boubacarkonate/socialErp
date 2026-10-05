import { dark } from '@clerk/themes';
import type { Appearance } from '@clerk/types';

/**
 * Apparence Clerk adaptée au thème de l'app (dark / light).
 * On laisse le thème Clerk gérer fonds + textes (toujours lisibles),
 * on ne personnalise que la couleur de marque et les arrondis.
 * Utilisée par la card de connexion (SignIn) et le menu UserButton.
 */
export function clerkAppearance(isDark: boolean): Appearance {
  return {
    baseTheme: isDark ? dark : undefined,
    variables: {
      colorPrimary: '#6366f1',
      borderRadius: '0.75rem',
    },
  };
}
