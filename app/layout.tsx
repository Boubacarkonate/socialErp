import { frFR } from '@clerk/localizations';
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ProductsProvider } from "./Context/CartContext";
import { SideBarProvider } from "./Context/SideBarContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Social ERP — Gestion d'entreprise",
  description: "Plateforme ERP moderne pour la gestion de vos équipes, produits et plannings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={frFR}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#0f172a",
          colorInputBackground: "#1e293b",
          colorInputText: "#f1f5f9",
          borderRadius: "0.5rem",
        },
      }}
    >
      <html lang="fr" className={inter.variable}>
        <body className={`${inter.className} antialiased`} suppressHydrationWarning>
          <SideBarProvider>
            <ProductsProvider>
              {children}
            </ProductsProvider>
          </SideBarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
