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
  const [hasScrolled, setHasScrolled] = useState(false);
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
      // Wait for user to scroll further down before showing banner
      const handleScroll = () => {
        if (window.scrollY > 400) {
          setHasScrolled(true);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      // Also show after 10 seconds if no scroll
      const fallbackTimer = setTimeout(() => {
        setHasScrolled(true);
      }, 10000);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(fallbackTimer);
      };
    } else {
      // Load saved preferences
      try {
        const parsed = JSON.parse(savedConsent) as CookiePreferences;
        setPreferences(parsed);

        // Re-show banner if consent is > 6 months old (RGPD requirement)
        const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
        if (parsed.timestamp < sixMonthsAgo) {
          setHasScrolled(true);
        }
      } catch (error) {
        setHasScrolled(true);
      }
    }
  }, []);

  // Show banner with delay after scroll detected
  useEffect(() => {
    if (hasScrolled && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hasScrolled, isVisible]);

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
        className="fixed bottom-4 right-4 z-[9999] max-w-sm"
      >
        <div className="bg-background border border-primary/20 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-3">
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm">🍪</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-heading font-bold text-primary mb-0.5">
                  Cookies
                </h3>
                <p className="text-[11px] text-primary/70 leading-tight">
                  Nous utilisons des cookies pour améliorer votre expérience.
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
            <div className="mt-2 flex gap-2">
              {showDetails ? (
                <>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 px-2 py-1.5 text-[11px] text-primary hover:bg-primary/5 rounded-md transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-2 py-1.5 text-[11px] border border-primary/20 text-primary rounded-md hover:bg-primary/5 transition-all"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={handleSaveCustom}
                    className="flex-1 px-2 py-1.5 text-[11px] bg-primary text-background rounded-md hover:bg-accent transition-colors font-medium"
                  >
                    OK
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="flex-1 px-2 py-1.5 text-[11px] text-primary hover:bg-primary/5 rounded-md transition-colors"
                  >
                    Options
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-2 py-1.5 text-[11px] border border-primary/20 text-primary rounded-md hover:bg-primary/5 transition-all"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-2 py-1.5 text-[11px] bg-primary text-background rounded-md hover:bg-accent transition-colors font-medium"
                  >
                    Accepter
                  </button>
                </>
              )}
            </div>

            {/* Link to privacy policy */}
            <p className="mt-1.5 text-[9px] text-primary/40 text-center">
              <Link href="/mentions-legales" className="underline hover:text-primary">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
