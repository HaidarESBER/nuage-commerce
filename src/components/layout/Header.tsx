"use client";

import Link from "next/link";
import { Container } from "@/components/ui";
import { CartButton } from "@/components/cart";

/**
 * Site header with brand name and navigation
 *
 * Features:
 * - Brand logo/name linking to home
 * - CartButton with item count
 * - Sticky positioning
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-background-secondary">
      <Container size="lg">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl text-primary">Nuage</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/produits"
              className="text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              Produits
            </Link>
            <CartButton />
          </nav>
        </div>
      </Container>
    </header>
  );
}
