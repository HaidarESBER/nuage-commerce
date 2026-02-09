"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { ProductCard } from "@/components/product";
import { getFeaturedProducts } from "@/data/products";

/**
 * Homepage with hero section and featured products
 *
 * Features:
 * - Full-height hero with brand tagline and CTA
 * - Featured products section showcasing premium items
 * - French content throughout
 */
export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <Container size="lg">
          <div className="flex flex-col items-center text-center py-16 md:py-24">
            {/* Brand tagline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary mb-6"
            >
              L&apos;art de la detente
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted max-w-2xl mb-10"
            >
              Accessoires chicha premium pour les connaisseurs
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/produits"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors"
              >
                Decouvrir la collection
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-background-secondary">
        <Container size="lg">
          {/* Section title */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">
              Selection Premium
            </h2>
            <p className="text-muted">
              Nos produits les plus apprecies par les connaisseurs
            </p>
          </div>

          {/* Featured products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
              />
            ))}
          </div>

          {/* Link to full catalog */}
          <div className="text-center">
            <Link
              href="/produits"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary border border-primary rounded-[--radius-button] hover:bg-primary hover:text-background transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>
        </Container>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-background">
        <Container size="lg">
          <TrustBadges />
        </Container>
      </section>
    </>
  );
}
