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
    <div className="sticky top-0 z-[9998] bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-3 py-1.5">
        <div className="flex items-center gap-2">
          {/* Warning icon */}
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />
          </div>

          {/* Warning text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-amber-900">
              <strong className="font-semibold">Avertissement :</strong>{" "}
              <span>Fumer est dangereux pour la santé.</span>{" "}
              <span className="hidden sm:inline text-amber-800">18+ uniquement.</span>
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-auto p-0.5 text-amber-600 hover:text-amber-800 transition-colors"
            aria-label="Masquer l'avertissement"
            title="Masquer"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
