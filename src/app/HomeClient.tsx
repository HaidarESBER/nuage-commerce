"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { ProductCard } from "@/components/product";
import { FracturedCategories } from "@/components/home/FracturedCategories";
import { Product } from "@/types/product";

interface HomeClientProps {
  featuredProducts: Product[];
}

export function HomeClient({ featuredProducts }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading screen for 3 seconds every time homepage loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen - Shows every time homepage is visited */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/nuage-loading-video.mp4" type="video/mp4" />
            </video>

            {/* Loading text overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </div>
                <p className="text-white/80 text-sm tracking-wider">CHARGEMENT...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Cinematic Video Background */}
      <section className="relative h-screen overflow-hidden -mt-16">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/nuage.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Content Container */}
        <Container size="lg" className="relative h-full">
          <div className="flex flex-col items-center justify-center text-center h-full px-4">
            {/* Brand tagline - synced with smoke clearing */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.4,
                delay: 3.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6"
              style={{
                textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)',
                fontWeight: 300,
                letterSpacing: '0.02em'
              }}
            >
              L&apos;Art de la{" "}
              <span
                className="block md:inline mt-2 md:mt-0 italic text-[#D4A5A5]"
                style={{
                  textShadow: '0 0 40px rgba(212,165,165,0.8), 0 4px 30px rgba(0,0,0,0.8)',
                  fontWeight: 300
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
              className="text-base md:text-lg text-white/90 max-w-xl mb-8"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 1px 5px rgba(0,0,0,0.6)'
              }}
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
                className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-white/95 text-[#2C2C2C] rounded-full hover:bg-[#D4A5A5] hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Decouvrir la collection
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
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

            {/* Scroll indicator - animated pulse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 5.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", type: "tween" }}
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

      {/* Fractured Glass Categories Section */}
      <FracturedCategories />

      {/* Trust Badges Section */}
      <section className="py-12 bg-background">
        <Container size="lg">
          <TrustBadges />
        </Container>
      </section>
    </>
  );
}
