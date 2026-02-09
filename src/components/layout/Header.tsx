"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui";
import { CartButton } from "@/components/cart";

/**
 * Site header with brand name and navigation
 *
 * Features:
 * - Brand logo/name linking to home
 * - CartButton with item count
 * - Sticky positioning
 * - Mobile hamburger menu with overlay navigation
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on navigation
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-background-secondary">
      <Container size="lg">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl text-primary">Nuage</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/produits"
              className="text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              Produits
            </Link>
            <CartButton />
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center gap-4">
            <CartButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-primary hover:text-accent transition-colors"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              {/* Hamburger Icon */}
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-6 bg-current transform transition-transform duration-200 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transform transition-transform duration-200 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          isMenuOpen ? "max-h-48" : "max-h-0"
        }`}
      >
        <nav className="bg-background border-b border-background-secondary">
          <Container size="lg">
            <div className="py-4 flex flex-col gap-4">
              <Link
                href="/produits"
                onClick={handleNavClick}
                className={`text-base font-medium transition-colors ${
                  pathname === "/produits"
                    ? "text-accent"
                    : "text-primary hover:text-accent"
                }`}
              >
                Produits
              </Link>
              <Link
                href="/panier"
                onClick={handleNavClick}
                className={`text-base font-medium transition-colors ${
                  pathname === "/panier"
                    ? "text-accent"
                    : "text-primary hover:text-accent"
                }`}
              >
                Panier
              </Link>
            </div>
          </Container>
        </nav>
      </div>
    </header>
  );
}
