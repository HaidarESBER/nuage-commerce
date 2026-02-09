import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuage | L'art de la detente",
  description:
    "Boutique en ligne d'accessoires chicha haut de gamme. Chichas, bols, tuyaux, charbon et accessoires de qualite pour les connaisseurs.",
  keywords: ["chicha", "hookah", "narguilé", "accessoires", "premium", "France"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${fontVariables} font-sans antialiased`}>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
