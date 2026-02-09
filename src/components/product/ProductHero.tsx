"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui";

/**
 * Hero section for products page
 *
 * Features:
 * - Eye-catching gradient background
 * - Animated text
 * - CTA buttons
 * - Stats or highlights
 */
export function ProductHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent/20 rounded-[--radius-card] mb-12">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative px-8 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 backdrop-blur-sm rounded-full text-background text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Nouveautés disponibles
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-background mb-6"
          >
            Découvrez Notre{" "}
            <span className="text-accent italic">Collection Premium</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-background/90 text-lg md:text-xl mb-8 max-w-2xl"
          >
            Des chichas et accessoires de qualité supérieure, sélectionnés avec soin pour
            une expérience unique.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#products"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-background text-primary rounded-[--radius-button] hover:bg-accent hover:text-background transition-colors"
            >
              Explorer maintenant
            </a>
            <Link
              href="/favoris"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-transparent border-2 border-background text-background rounded-[--radius-button] hover:bg-background hover:text-primary transition-colors"
            >
              Voir mes favoris
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-background/20"
          >
            <div>
              <div className="text-3xl font-bold text-background">50+</div>
              <div className="text-background/70 text-sm mt-1">Produits</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-background">100%</div>
              <div className="text-background/70 text-sm mt-1">Qualité Premium</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-background">24h</div>
              <div className="text-background/70 text-sm mt-1">Livraison Express</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
