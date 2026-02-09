import Link from "next/link";
import { Container } from "@/components/ui";

/**
 * Site footer with brand, navigation, and legal links
 *
 * Features:
 * - Three-column layout on desktop, stacked on mobile
 * - Brand section with tagline
 * - Navigation links to main pages
 * - Legal/information links
 * - Copyright bar with current year
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-background">
      {/* Main footer content */}
      <div className="py-12">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 - Brand */}
            <div>
              <h3 className="font-heading text-2xl mb-2">Nuage</h3>
              <p className="text-background/80">L&apos;art de la detente</p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h4 className="font-medium text-sm uppercase tracking-wide mb-4">
                Navigation
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Accueil
                </Link>
                <Link
                  href="/produits"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Produits
                </Link>
                <Link
                  href="/panier"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Panier
                </Link>
              </nav>
            </div>

            {/* Column 3 - Legal */}
            <div>
              <h4 className="font-medium text-sm uppercase tracking-wide mb-4">
                Informations
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Mentions legales
                </Link>
                <Link
                  href="#"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  CGV
                </Link>
                <Link
                  href="#"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright bar */}
      <div className="py-4 border-t border-background/20">
        <Container size="lg">
          <p className="text-sm text-background/60 text-center">
            &copy; {currentYear} Nuage. Tous droits reserves.
          </p>
        </Container>
      </div>
    </footer>
  );
}
