"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, EyeIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Product } from "@/types/product";

interface UrgencyIndicatorsProps {
  product: Product;
}

type UrgencyType = "time-limited" | "social-proof" | "recent-purchase" | "none";

/**
 * Urgency indicators to create FOMO without feeling manipulative
 * Uses sessionStorage for consistency and respects rules to avoid overuse
 */
export function UrgencyIndicators({ product }: UrgencyIndicatorsProps) {
  const [urgencyType, setUrgencyType] = useState<UrgencyType>("none");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Determine urgency type (prioritized, max 1 per product, 30% show nothing)
    const storageKey = `urgency-${product.id}`;
    const storedType = sessionStorage.getItem(storageKey);

    if (storedType) {
      setUrgencyType(storedType as UrgencyType);
    } else {
      // Apply urgency rules
      let selectedType: UrgencyType = "none";

      // Priority 1: Stock < 5 (most urgent)
      if (product.inStock && product.stockLevel !== undefined && product.stockLevel < 5) {
        // Stock urgency is handled by StockIndicator, skip urgency here
        selectedType = "none";
      }
      // Priority 2: Recent purchase (only for 4+ star products with reviews)
      else if (Math.random() > 0.3 && product.featured) {
        // Assume featured products have good reviews
        selectedType = "recent-purchase";
      }
      // Priority 3: Time-limited offer (for products with compare price)
      else if (Math.random() > 0.3 && product.compareAtPrice) {
        selectedType = "time-limited";
      }
      // Priority 4: Social proof (only for products with stock < 20)
      else if (
        Math.random() > 0.3 &&
        product.inStock &&
        product.stockLevel !== undefined &&
        product.stockLevel < 20
      ) {
        selectedType = "social-proof";
      }
      // 30% show no urgency (authenticity)
      else {
        selectedType = "none";
      }

      setUrgencyType(selectedType);
      sessionStorage.setItem(storageKey, selectedType);
    }

    // Generate consistent random values based on product ID
    const seed = product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    setViewerCount(seededRandom(3, 12));
    setMinutesAgo(seededRandom(3, 45));
  }, [product]);

  // Countdown timer for time-limited offers
  useEffect(() => {
    if (urgencyType !== "time-limited") return;

    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [urgencyType]);

  // Fade in animation after mount
  useEffect(() => {
    if (urgencyType === "recent-purchase") {
      // Recent purchase appears after 2s
      const timeout = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timeout);
    } else if (urgencyType !== "none") {
      setIsVisible(true);
    }
  }, [urgencyType]);

  if (urgencyType === "none") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          {urgencyType === "time-limited" && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-error/10 to-error/5 border border-error/20 rounded-[--radius-button]">
              <ClockIcon className="w-5 h-5 text-error" />
              <span className="text-sm font-medium text-error">
                Offre limitée : encore {timeRemaining}
              </span>
            </div>
          )}

          {urgencyType === "social-proof" && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-background-secondary border border-muted/20 rounded-[--radius-button]">
              <EyeIcon className="w-5 h-5 text-accent" />
              <span className="text-sm text-primary">
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, type: "tween" }}
                  className="inline-block font-medium"
                >
                  {viewerCount}
                </motion.span>{" "}
                personnes consultent ce produit actuellement
              </span>
            </div>
          )}

          {urgencyType === "recent-purchase" && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-background-secondary border border-muted/20 rounded-[--radius-button]">
              <ShoppingBagIcon className="w-5 h-5 text-accent" />
              <span className="text-sm text-primary">
                Dernière commande : il y a{" "}
                <span className="font-medium">{minutesAgo} minutes</span>
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
