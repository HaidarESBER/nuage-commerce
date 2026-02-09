"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui";
import { CartButton } from "@/components/cart";
import { useWishlist } from "@/contexts/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";

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
  const { wishlistItems } = useWishlist();

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

            {/* Wishlist button */}
            <Link
              href="/favoris"
              className="relative text-primary hover:text-accent transition-colors"
              aria-label={`Favoris (${wishlistItems.length} produit${wishlistItems.length > 1 ? 's' : ''})`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistItems.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wishlistItems.length}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.5 }}
                    transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -top-2 -right-2 bg-accent text-background text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {wishlistItems.length}
                  </motion.span>
                </AnimatePresence>
              )}
            </Link>

            <CartButton />
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center gap-4">
            {/* Wishlist button */}
            <Link
              href="/favoris"
              className="relative text-primary hover:text-accent transition-colors"
              aria-label={`Favoris (${wishlistItems.length} produit${wishlistItems.length > 1 ? 's' : ''})`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistItems.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wishlistItems.length}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.5 }}
                    transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -top-2 -right-2 bg-accent text-background text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {wishlistItems.length}
                  </motion.span>
                </AnimatePresence>
              )}
            </Link>

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
                href="/favoris"
                onClick={handleNavClick}
                className={`text-base font-medium transition-colors ${
                  pathname === "/favoris"
                    ? "text-accent"
                    : "text-primary hover:text-accent"
                }`}
              >
                Favoris {wishlistItems.length > 0 && `(${wishlistItems.length})`}
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
