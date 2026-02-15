"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { calculateTotalItems } from "@/types/cart";

/**
 * CartButton component for header navigation
 *
 * Features:
 * - Cart icon with item count badge
 * - Links to /panier
 * - Badge only shows when items > 0
 */
export function CartButton({ isHomepage }: { isHomepage?: boolean }) {
  const { items } = useCart();
  const totalItems = calculateTotalItems(items);

  return (
    <Link
      href="/panier"
      className="relative inline-flex items-center justify-center p-2 text-white/90 hover:text-primary transition-colors"
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
        <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-medium rounded-full px-1.5 shadow-[0_0_10px_rgba(18,222,38,0.5)]">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
