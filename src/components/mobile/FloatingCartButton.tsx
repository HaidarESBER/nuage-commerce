"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { calculateTotalItems } from "@/types/cart";

/**
 * FloatingCartButton component for mobile thumb-friendly cart access
 *
 * Features:
 * - Fixed position in bottom-right corner (thumb zone)
 * - Shows after scrolling 200px down
 * - Badge with cart item count
 * - Badge animation when count changes
 * - Pulse animation when item added
 * - Shake animation when cart is empty and tapped
 * - Hidden on cart and checkout pages
 * - Mobile only (<768px)
 */
export function FloatingCartButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { items } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const totalItems = calculateTotalItems(items);
  const SCROLL_THRESHOLD = 200;

  // Pages where FAB should be hidden
  const hiddenPages = ["/panier", "/commande"];
  // Also hide on product detail pages (e.g., /produits/[slug])
  const isProductDetailPage = pathname.startsWith("/produits/") && pathname !== "/produits";
  const shouldHide = hiddenPages.some((page) => pathname.startsWith(page)) || isProductDetailPage;

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      setIsVisible(scrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pulse animation when item count increases
  useEffect(() => {
    if (totalItems > previousCount && previousCount !== 0) {
      setShouldPulse(true);
      setTimeout(() => setShouldPulse(false), 600);
    }
    setPreviousCount(totalItems);
  }, [totalItems, previousCount]);

  const handleClick = () => {
    if (totalItems === 0) {
      // Shake animation if cart is empty
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
    } else {
      router.push("/panier");
    }
  };

  // Don't render on desktop or hidden pages
  if (!isMobile || shouldHide) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            scale: shouldPulse ? [1, 1.2, 1] : 1,
            rotate: shouldShake ? [0, -10, 10, -10, 10, 0] : 0,
          }}
          exit={{ x: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          onClick={handleClick}
          className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-primary text-background rounded-full shadow-lg hover:bg-accent hover:text-primary transition-colors z-40"
          aria-label={`Panier${totalItems > 0 ? ` (${totalItems} articles)` : ""}`}
        >
          {/* Cart icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>

          {/* Item count badge */}
          {totalItems > 0 && (
            <motion.span
              key={totalItems}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 20,
              }}
              className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-error text-background text-xs font-medium rounded-full px-1.5"
            >
              {totalItems > 99 ? "99+" : totalItems}
            </motion.span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
