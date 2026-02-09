import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Header, Footer } from "@/components/layout";
import { FloatingCartButton } from "@/components/mobile/FloatingCartButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuage | L'art de la detente",
  description:
    "Boutique en ligne d'accessoires chicha haut de gamme. Chichas, bols, tuyaux, charbon et accessoires de qualite pour les connaisseurs.",
  keywords: ["chicha", "hookah", "narguilé", "accessoires", "premium", "France"],
  metadataBase: new URL("https://nuage.fr"),
  openGraph: {
    title: "Nuage | L'art de la detente",
    description:
      "Boutique en ligne d'accessoires chicha haut de gamme. Chichas, bols, tuyaux, charbon et accessoires de qualite pour les connaisseurs.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuage | L'art de la detente",
    description:
      "Boutique en ligne d'accessoires chicha haut de gamme. Chichas, bols, tuyaux, charbon et accessoires de qualite pour les connaisseurs.",
  },
  robots: "index, follow",
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
          <WishlistProvider>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <FloatingCartButton />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
