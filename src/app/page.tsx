"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { ProductCard } from "@/components/product";
import { getFeaturedProducts } from "@/data/products";

/**
 * Homepage with cinematic video hero and featured products
 *
 * Features:
 * - Full-screen video hero with smoke reveal effect
 * - Glassmorphism text overlay synchronized with video
 * - Featured products section showcasing premium items
 * - French content throughout
 */
export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      {/* Hero Section - Cinematic Video Background */}
      <section className="relative h-screen overflow-hidden -mt-16">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/nuage1.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Content Container */}
        <Container size="lg" className="relative h-full">
          <div className="flex flex-col items-center justify-center text-center h-full px-4">
            {/* Glassmorphism card - appears as smoke clears */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 lg:p-16 max-w-4xl shadow-2xl"
            >
              {/* Brand tagline - synced with smoke clearing */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.4,
                  delay: 3.2,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="font-heading text-6xl md:text-7xl lg:text-8xl text-white mb-8 drop-shadow-2xl tracking-wide"
                style={{
                  textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 60px rgba(212,165,165,0.3)',
                  letterSpacing: '0.05em'
                }}
              >
                L&apos;Art de la{" "}
                <span
                  className="block md:inline mt-2 md:mt-0 italic text-[#D4A5A5]"
                  style={{
                    textShadow: '0 0 40px rgba(212,165,165,0.8), 0 4px 20px rgba(0,0,0,0.5)'
                  }}
                >
                  Détente
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 4, ease: "easeOut" }}
                className="text-xl md:text-2xl text-white/90 max-w-2xl mb-10 drop-shadow-md"
              >
                Accessoires chicha premium pour les connaisseurs
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 4.5, ease: "easeOut" }}
              >
                <Link
                  href="/produits"
                  className="group inline-flex items-center justify-center px-10 py-5 text-lg font-medium bg-white/95 text-[#2C2C2C] rounded-full hover:bg-[#D4A5A5] hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Decouvrir la collection
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll indicator - animated pulse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 5.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center text-white/70"
              >
                <span className="text-sm mb-2 tracking-wider">SCROLL</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
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
