import { frFR } from '@clerk/localizations';
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from '@clerk/themes';
import type { Metadata } from "next";
import { ProductsProvider } from "./Context/CartContext";
import { SideBarProvider } from "./Context/SideBarContext";
import "./globals.css";



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR} appearance={{ baseTheme: shadesOfPurple }}>
      <html lang="fr">
        <body className="font-sans">
          <SideBarProvider>
            <ProductsProvider>
              {/* ✅ Conteneur bien positionné pour le bouton */}
              {/* <NavBar /> */}
              {/* <div className="absolute right-0 top-0 p-4 flex items-center">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton showName />
                </SignedIn>
              </div> */}

              {children}
            </ProductsProvider>
          </SideBarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
