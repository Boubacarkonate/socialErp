'use client';

import { clerkAppearance } from '@/app/Context/clerkAppearance';
import { useTheme } from '@/app/Context/ThemeContext';
import { SignIn } from '@clerk/nextjs';

export default function ClerkCard() {
  const { theme } = useTheme();
  return <SignIn appearance={clerkAppearance(theme === 'dark')} />;
}
