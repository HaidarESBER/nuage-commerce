"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui";
import { CartButton } from "@/components/cart";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { useWishlist } from "@/contexts/WishlistContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";
import { categoryLabels, ProductCategory } from "@/types/product";

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
  const { comparisonItems } = useComparison();

  // Close menu on navigation
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Homepage has transparent header - video shows through
  const isHomepage = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isHomepage
          ? "bg-black/30 backdrop-blur-md border-b border-white/10"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-background-secondary"
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/nuagelogonobg1.png"
              alt="Nuage Logo"
              className="h-12 w-auto object-contain"
            />
            <span
              className={`font-heading text-2xl transition-colors ${
                isHomepage ? "text-white drop-shadow-lg" : "text-primary"
              }`}
            >
              Nuage
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <HeaderSearch isHomepage={isHomepage} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
            <Link
              href="/produits"
              className={`text-sm font-medium transition-colors ${
                isHomepage
                  ? "text-white/90 hover:text-white drop-shadow"
                  : "text-primary hover:text-accent"
              }`}
            >
              Produits
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${
                isHomepage
                  ? "text-white/90 hover:text-white drop-shadow"
                  : "text-primary hover:text-accent"
              }`}
            >
              Blog
            </Link>

            {/* Wishlist button */}
            <Link
              href="/compte/wishlist"
              className={`relative transition-colors ${
                isHomepage
                  ? "text-white/90 hover:text-white drop-shadow"
                  : "text-primary hover:text-accent"
              }`}
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

            {/* Comparison button */}
            {comparisonItems.length > 0 && (
              <Link
                href="/comparaison"
                className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Comparer ({comparisonItems.length})
              </Link>
            )}

            {/* Account button */}
            <Link
              href="/compte"
              className={`transition-colors ${
                isHomepage
                  ? "text-white/90 hover:text-white drop-shadow"
                  : "text-primary hover:text-accent"
              }`}
              aria-label="Mon compte"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <CartButton isHomepage={isHomepage} />
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center gap-4">
            {/* Wishlist button */}
            <Link
              href="/compte/wishlist"
              className={`relative transition-colors ${
                isHomepage
                  ? "text-white/90 hover:text-white drop-shadow"
                  : "text-primary hover:text-accent"
              }`}
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

            <CartButton isHomepage={isHomepage} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition-colors ${
                isHomepage
                  ? "text-white/90 hover:text-white drop-shadow"
                  : "text-primary hover:text-accent"
              }`}
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
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <nav className="bg-background border-b border-background-secondary overflow-y-auto">
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
                Tous les Produits
              </Link>

              {/* Categories */}
              <div className="pl-4 flex flex-col gap-3 border-l-2 border-border">
                <Link
                  href="/produits?categorie=chicha"
                  onClick={handleNavClick}
                  className="text-sm font-light text-muted hover:text-primary transition-colors"
                >
                  {categoryLabels.chicha}
                </Link>
                <Link
                  href="/produits?categorie=bol"
                  onClick={handleNavClick}
                  className="text-sm font-light text-muted hover:text-primary transition-colors"
                >
                  {categoryLabels.bol}
                </Link>
                <Link
                  href="/produits?categorie=tuyau"
                  onClick={handleNavClick}
                  className="text-sm font-light text-muted hover:text-primary transition-colors"
                >
                  {categoryLabels.tuyau}
                </Link>
                <Link
                  href="/produits?categorie=charbon"
                  onClick={handleNavClick}
                  className="text-sm font-light text-muted hover:text-primary transition-colors"
                >
                  {categoryLabels.charbon}
                </Link>
                <Link
                  href="/produits?categorie=accessoire"
                  onClick={handleNavClick}
                  className="text-sm font-light text-muted hover:text-primary transition-colors"
                >
                  {categoryLabels.accessoire}
                </Link>
              </div>

              <Link
                href="/blog"
                onClick={handleNavClick}
                className={`text-base font-medium transition-colors ${
                  pathname.startsWith("/blog")
                    ? "text-accent"
                    : "text-primary hover:text-accent"
                }`}
              >
                Blog
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
                href="/compte"
                onClick={handleNavClick}
                className={`text-base font-medium transition-colors ${
                  pathname === "/compte"
                    ? "text-accent"
                    : "text-primary hover:text-accent"
                }`}
              >
                Mon Compte
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
