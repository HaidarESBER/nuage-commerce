"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Age verification modal - MANDATORY for 18+ products
 *
 * Features:
 * - Blocks entire site access until verified
 * - Session storage (shows once per session)
 * - Redirects minors to Google
 * - Cannot be bypassed (no X button)
 */
export function AgeVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if already verified this session
    const verified = sessionStorage.getItem("nuage_age_verified");

    if (verified === "true") {
      setIsVerified(true);
    } else {
      // Small delay for better UX (let page start loading)
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem("nuage_age_verified", "true");
    setIsVerified(true);
    setShowModal(false);
  };

  const handleDeny = () => {
    // Redirect minors away from site
    window.location.href = "https://www.service-public.fr/particuliers/vosdroits/F2123";
  };

  // Don't render anything if verified
  if (isVerified && !showModal) {
    return null;
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ pointerEvents: showModal ? 'auto' : 'none' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-background rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl border border-primary/10"
          >
            {/* Logo */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔞</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Vérification d&apos;âge
            </h2>

            {/* Description */}
            <div className="mb-8 space-y-3">
              <p className="text-primary/70 text-lg">
                Vous devez être âgé(e) de <strong className="text-primary">18 ans ou plus</strong> pour accéder à ce site.
              </p>
              <p className="text-sm text-primary/50">
                En confirmant, vous certifiez avoir l&apos;âge légal requis pour acheter et utiliser nos produits.
              </p>
            </div>

            {/* Warning box */}
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>⚠️ Avertissement santé :</strong> Fumer est dangereux pour la santé.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeny}
                className="flex-1 px-6 py-3 border-2 border-primary/20 text-primary rounded-[--radius-button] hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 font-medium"
              >
                J&apos;ai moins de 18 ans
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-primary text-background rounded-[--radius-button] hover:bg-accent transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                J&apos;ai 18 ans ou plus
              </button>
            </div>

            {/* Legal notice */}
            <p className="mt-6 text-xs text-primary/40">
              Conformément à la législation française, la vente de nos produits est strictement interdite aux mineurs.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
