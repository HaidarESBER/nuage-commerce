"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui";
import { CartButton } from "@/components/cart";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useWishlist } from "@/contexts/WishlistContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";
import { categoryLabels, ProductCategory } from "@/types/product";
import { createClient } from "@/lib/supabase/client";
import { Settings } from "lucide-react";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { wishlistItems } = useWishlist();
  const { comparisonItems } = useComparison();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is admin - must match middleware logic
  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      console.log('🔍 Header Admin Check - User ID:', user?.id);
      console.log('🔍 Header Admin Check - Email:', user?.email);

      if (user) {
        // Check profiles.is_admin - same as middleware
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        console.log('🔍 Header Admin Check - Profile:', profile);
        console.log('🔍 Header Admin Check - Error:', error);
        console.log('🔍 Header Admin Check - is_admin value:', profile?.is_admin);

        const isAdminUser = profile?.is_admin === true;
        console.log('🔍 Header Admin Check - Final isAdmin:', isAdminUser);
        setIsAdmin(isAdminUser);
      } else {
        console.log('🔍 Header Admin Check - No user logged in');
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Close menu on navigation
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Homepage has transparent header - video shows through
  const isHomepage = pathname === "/";

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-primary text-background-dark py-1 md:py-1.5 text-center text-[10px] md:text-xs font-semibold tracking-wide z-50 sticky top-0">
        LIVRAISON OFFERTE DÈS 80€ D'ACHAT — EXPÉDITION SOUS 24H
      </div>

      {/* Main Header */}
      <header className="sticky top-[30px] z-40 glass-header transition-all duration-300 border-b border-white/5">
        <Container size="lg">
          <div className="flex items-center justify-between h-14 md:h-16 gap-2 md:gap-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <img
              src="/nuagelogonobg1.png"
              alt="Nuage Logo"
              className="h-7 md:h-9 w-auto object-contain"
            />
            <span className="font-heading text-lg md:text-xl text-white hover:text-primary transition-colors">
              Nuage
            </span>
          </Link>

          {/* Desktop Search & Navigation */}
          <div className="hidden md:flex items-center gap-4 flex-grow justify-end">
            {/* Inline Search Bar */}
            <div className="relative max-w-sm w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-gray-400 text-base">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher..."
                onFocus={() => setIsSearchOpen(true)}
                className="w-full h-10 bg-surface-dark/50 border border-white/10 rounded-full text-sm text-white placeholder-gray-400 focus:border-primary focus:outline-none pl-10 pr-4"
              />
            </div>

            <nav className="flex items-center gap-4 h-10">
            <Link
              href="/produits"
              className="text-xs font-medium text-white/90 hover:text-primary transition-colors"
            >
              Produits
            </Link>
            <Link
              href="/blog"
              className="text-xs font-medium text-white/90 hover:text-primary transition-colors"
            >
              Blog
            </Link>

            {/* Wishlist button */}
            <Link
              href="/compte/wishlist"
              className="relative text-white/90 hover:text-primary transition-colors"
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
                    className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(18,222,38,0.5)]"
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
                className="text-sm font-medium text-white/90 hover:text-primary transition-colors flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Comparer ({comparisonItems.length})
              </Link>
            )}

            {/* Account button */}
            <Link
              href="/compte/profil"
              className="text-white/90 hover:text-primary transition-colors"
              aria-label="Mon profil"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Admin button - only visible to admins */}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-white/90 hover:text-primary transition-colors flex items-center gap-1"
                aria-label="Admin Panel"
                title="Admin Panel"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}

            <CartButton isHomepage={isHomepage} />
            </nav>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center gap-3">
            {/* Search button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white/90 hover:text-primary transition-colors"
              aria-label="Rechercher"
            >
              <span className="material-icons text-xl">search</span>
            </button>

            <CartButton isHomepage={isHomepage} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white/90 hover:text-primary transition-colors"
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

      {/* Mobile Menu Overlay - Rendered via Portal */}
      {mounted && isMenuOpen && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
          }}
        >
          {/* Backdrop */}
          <div
            onClick={handleNavClick}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Sliding Menu Panel */}
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 w-[280px] bg-background-dark/98 backdrop-blur-xl border-l border-white/10 overflow-y-auto shadow-2xl"
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Menu Header */}
            <div className="sticky top-0 bg-background-dark/95 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between z-10">
              <span className="font-heading text-lg text-white font-bold">Menu</span>
              <button
                onClick={handleNavClick}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Fermer le menu"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4 flex flex-col gap-1 pb-safe"
                {/* Products */}
                <Link
                  href="/produits"
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    pathname === "/produits"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <span className="material-icons text-lg">inventory_2</span>
                  <span className="text-sm font-medium">Tous les Produits</span>
                </Link>

                {/* Categories Submenu */}
                <div className="ml-3 pl-3 border-l border-white/10 mt-1 mb-2 flex flex-col gap-0.5">
                  <Link
                    href="/produits?categorie=chicha"
                    onClick={handleNavClick}
                    className="px-3 py-1.5 text-xs text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                  >
                    {categoryLabels.chicha}
                  </Link>
                  <Link
                    href="/produits?categorie=bol"
                    onClick={handleNavClick}
                    className="px-3 py-1.5 text-xs text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                  >
                    {categoryLabels.bol}
                  </Link>
                  <Link
                    href="/produits?categorie=tuyau"
                    onClick={handleNavClick}
                    className="px-3 py-1.5 text-xs text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                  >
                    {categoryLabels.tuyau}
                  </Link>
                  <Link
                    href="/produits?categorie=charbon"
                    onClick={handleNavClick}
                    className="px-3 py-1.5 text-xs text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                  >
                    {categoryLabels.charbon}
                  </Link>
                  <Link
                    href="/produits?categorie=accessoire"
                    onClick={handleNavClick}
                    className="px-3 py-1.5 text-xs text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                  >
                    {categoryLabels.accessoire}
                  </Link>
                </div>

                {/* Blog */}
                <Link
                  href="/blog"
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    pathname.startsWith("/blog")
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <span className="material-icons text-lg">article</span>
                  <span className="text-sm font-medium">Blog</span>
                </Link>

                {/* Wishlist */}
                <Link
                  href="/compte/wishlist"
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    pathname === "/compte/wishlist"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <span className="material-icons text-lg">favorite</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium">Favoris</span>
                    {wishlistItems.length > 0 && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Comparison */}
                {comparisonItems.length > 0 && (
                  <Link
                    href="/comparaison"
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      pathname === "/comparaison"
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="material-icons text-lg">compare</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-medium">Comparer</span>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {comparisonItems.length}
                      </span>
                    </div>
                  </Link>
                )}

                {/* Profile */}
                <Link
                  href="/compte/profil"
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    pathname.startsWith("/compte") && pathname !== "/compte/wishlist"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <span className="material-icons text-lg">person</span>
                  <span className="text-sm font-medium">Mon Profil</span>
                </Link>

                {/* Admin link */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      pathname.startsWith("/admin")
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-white hover:bg-white/5"
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Admin Panel</span>
                  </Link>
                )}

                {/* Divider */}
                <div className="h-px bg-white/10 my-2"></div>

                {/* Cart */}
                <Link
                  href="/panier"
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    pathname === "/panier"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <span className="material-icons text-lg">shopping_cart</span>
                  <span className="text-sm font-medium">Panier</span>
                </Link>
              </div>
            </motion.nav>
          </motion.div>,
        document.body
      )}

      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
