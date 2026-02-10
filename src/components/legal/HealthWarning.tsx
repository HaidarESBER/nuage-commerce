"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

/**
 * Health warning banner - MANDATORY for tobacco-related products
 *
 * Features:
 * - Dismissible but reappears each new session
 * - Sticky top position (always visible)
 * - Mobile responsive
 * - Compliant with French health regulations
 */
export function HealthWarning() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in current session
    const dismissed = sessionStorage.getItem("nuage_health_warning_dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("nuage_health_warning_dismissed", "true");
    setIsVisible(false);
    setIsDismissed(true);
  };

  // Don't render if dismissed
  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="sticky top-0 z-[9998] bg-amber-50 border-b-2 border-amber-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Warning icon */}
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-700" />
          </div>

          {/* Warning text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm md:text-base text-amber-900">
              <strong className="font-semibold">Avertissement santé :</strong>{" "}
              <span className="font-medium">Fumer est dangereux pour la santé.</span>{" "}
              <span className="hidden sm:inline text-amber-800">
                Produits réservés aux personnes majeures (18+).
              </span>
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-auto p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
            aria-label="Masquer l'avertissement"
            title="Masquer (réapparaîtra à la prochaine visite)"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile: Additional line */}
        <p className="sm:hidden mt-2 text-xs text-amber-800">
          Réservé aux +18 ans
        </p>
      </div>
    </div>
  );
}
