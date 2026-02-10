"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * Cookie consent banner - RGPD/GDPR compliant
 *
 * Features:
 * - Granular consent (essential, analytics, marketing)
 * - Persists in localStorage
 * - Blocks non-essential scripts until consent
 * - Link to privacy policy
 * - Mobile responsive
 */

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true
    analytics: false,
    marketing: false,
    timestamp: 0,
  });

  useEffect(() => {
    // Check if consent already given
    const savedConsent = localStorage.getItem("nuage_cookie_consent");

    if (!savedConsent) {
      // Show banner after short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const parsed = JSON.parse(savedConsent) as CookiePreferences;
        setPreferences(parsed);

        // Re-show banner if consent is > 6 months old (RGPD requirement)
        const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
        if (parsed.timestamp < sixMonthsAgo) {
          setIsVisible(true);
        }
      } catch (error) {
        setIsVisible(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      timestamp: Date.now(),
    };

    localStorage.setItem("nuage_cookie_consent", JSON.stringify(consentData));
    setPreferences(consentData);
    setIsVisible(false);

    // Reload page to apply new consent (analytics/marketing scripts)
    window.location.reload();
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  };

  const handleRejectAll = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-background border-2 border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍪</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-heading font-bold text-primary mb-2">
                  Respect de votre vie privée
                </h3>
                <p className="text-sm text-primary/70">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site,
                  analyser le trafic et personnaliser le contenu. Vous pouvez choisir d&apos;accepter
                  tous les cookies ou personnaliser vos préférences.
                </p>
              </div>
            </div>

            {/* Detailed preferences (collapsible) */}
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 space-y-4 border-t border-primary/10 pt-6"
              >
                {/* Essential cookies */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="essential"
                    checked={true}
                    disabled
                    className="mt-1 w-5 h-5 rounded border-primary/30 text-primary focus:ring-accent disabled:opacity-50"
                  />
                  <div className="flex-1">
                    <label htmlFor="essential" className="font-semibold text-primary block mb-1">
                      Cookies essentiels <span className="text-xs text-primary/50">(obligatoires)</span>
                    </label>
                    <p className="text-sm text-primary/60">
                      Nécessaires au fonctionnement du site (panier, authentification, préférences).
                    </p>
                  </div>
                </div>

                {/* Analytics cookies */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-primary/30 text-primary focus:ring-accent"
                  />
                  <div className="flex-1">
                    <label htmlFor="analytics" className="font-semibold text-primary block mb-1 cursor-pointer">
                      Cookies analytiques
                    </label>
                    <p className="text-sm text-primary/60">
                      Nous aident à comprendre comment vous utilisez le site pour l&apos;améliorer
                      (Google Analytics, Microsoft Clarity).
                    </p>
                  </div>
                </div>

                {/* Marketing cookies */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-primary/30 text-primary focus:ring-accent"
                  />
                  <div className="flex-1">
                    <label htmlFor="marketing" className="font-semibold text-primary block mb-1 cursor-pointer">
                      Cookies marketing
                    </label>
                    <p className="text-sm text-primary/60">
                      Permettent de vous proposer des publicités pertinentes et de mesurer
                      l&apos;efficacité de nos campagnes (TikTok Pixel, Meta Pixel).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-[--radius-button] transition-colors"
              >
                {showDetails ? "Masquer les détails" : "Personnaliser"}
              </button>

              <div className="flex-1" />

              {showDetails ? (
                <>
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-3 border-2 border-primary/20 text-primary rounded-[--radius-button] hover:bg-primary/5 hover:border-primary/30 transition-all font-medium"
                  >
                    Tout refuser
                  </button>
                  <button
                    onClick={handleSaveCustom}
                    className="px-6 py-3 bg-primary text-background rounded-[--radius-button] hover:bg-accent transition-colors font-semibold"
                  >
                    Enregistrer mes choix
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-3 border-2 border-primary/20 text-primary rounded-[--radius-button] hover:bg-primary/5 hover:border-primary/30 transition-all font-medium"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-3 bg-primary text-background rounded-[--radius-button] hover:bg-accent transition-colors font-semibold shadow-lg"
                  >
                    Accepter tout
                  </button>
                </>
              )}
            </div>

            {/* Link to privacy policy */}
            <p className="mt-4 text-xs text-primary/50 text-center">
              <Link href="/mentions-legales" className="underline hover:text-primary">
                En savoir plus sur notre politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
