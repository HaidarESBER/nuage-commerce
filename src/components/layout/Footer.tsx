"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui";

/**
 * Site footer with brand, navigation, and legal links
 *
 * Features:
 * - Three-column layout on desktop, stacked on mobile
 * - Fade-in animation on scroll into viewport
 * - Column stagger effect (left → center → right)
 * - Brand section with tagline and hover scale
 * - Navigation links with hover micro-interactions
 * - Legal/information links with hover effects
 * - Copyright bar with current year
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer className="bg-primary text-background">
      {/* Main footer content */}
      <motion.div
        className="py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 - Brand */}
            <motion.div variants={columnVariants}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="mb-4"
              >
                <img
                  src="/nuagelogonobg1.png"
                  alt="Nuage Logo"
                  className="h-20 w-auto object-contain brightness-0 invert"
                />
              </motion.div>
              <p className="text-background/80">L&apos;art de la detente</p>
            </motion.div>

            {/* Column 2 - Navigation */}
            <motion.div variants={columnVariants}>
              <h4 className="font-medium text-sm uppercase tracking-wide mb-4">
                Navigation
              </h4>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="group inline-block w-fit">
                  <motion.span
                    className="relative text-background/80 transition-colors duration-200 group-hover:text-background"
                    whileHover={{ y: -1, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    Accueil
                    <motion.span
                      className="absolute bottom-0 left-0 h-px bg-background"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
                <Link href="/produits" className="group inline-block w-fit">
                  <motion.span
                    className="relative text-background/80 transition-colors duration-200 group-hover:text-background"
                    whileHover={{ y: -1, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    Produits
                    <motion.span
                      className="absolute bottom-0 left-0 h-px bg-background"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
                <Link href="/panier" className="group inline-block w-fit">
                  <motion.span
                    className="relative text-background/80 transition-colors duration-200 group-hover:text-background"
                    whileHover={{ y: -1, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    Panier
                    <motion.span
                      className="absolute bottom-0 left-0 h-px bg-background"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
                <Link href="/suivi" className="group inline-block w-fit">
                  <motion.span
                    className="relative text-background/80 transition-colors duration-200 group-hover:text-background"
                    whileHover={{ y: -1, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    Suivre ma commande
                    <motion.span
                      className="absolute bottom-0 left-0 h-px bg-background"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
              </nav>
            </motion.div>

            {/* Column 3 - Legal */}
            <motion.div variants={columnVariants}>
              <h4 className="font-medium text-sm uppercase tracking-wide mb-4">
                Informations
              </h4>
              <nav className="flex flex-col gap-2">
                <Link href="/mentions-legales" className="group inline-block w-fit">
                  <motion.span
                    className="relative text-background/80 transition-colors duration-200 group-hover:text-background"
                    whileHover={{ y: -1, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    Mentions légales
                    <motion.span
                      className="absolute bottom-0 left-0 h-px bg-background"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
                <Link href="/cgv" className="group inline-block w-fit">
                  <motion.span
                    className="relative text-background/80 transition-colors duration-200 group-hover:text-background"
                    whileHover={{ y: -1, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    CGV
                    <motion.span
                      className="absolute bottom-0 left-0 h-px bg-background"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
                <Link href="/contact" className="group inline-block w-fit">
                  <motion.span
                    className="relative text-background/80 transition-colors duration-200 group-hover:text-background"
                    whileHover={{ y: -1, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    Contact
                    <motion.span
                      className="absolute bottom-0 left-0 h-px bg-background"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
              </nav>
            </motion.div>
          </div>
        </Container>
      </motion.div>

      {/* Copyright bar */}
      <div className="py-4 border-t border-background/20">
        <Container size="lg">
          <p className="text-sm text-background/60 text-center">
            &copy; {currentYear} Nuage. Tous droits réservés.
          </p>
        </Container>
      </div>
    </footer>
  );
}
