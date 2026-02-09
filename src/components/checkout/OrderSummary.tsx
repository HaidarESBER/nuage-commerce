"use client";

import Image from "next/image";
import { CartItem, calculateSubtotal, formatCartTotal } from "@/types/cart";

interface OrderSummaryProps {
  items: CartItem[];
}

/**
 * OrderSummary component for checkout page
 *
 * Displays cart items in a compact format with:
 * - Product image, name, quantity, line total
 * - Subtotal
 * - Free shipping notice
 * - Order total
 */
export function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = calculateSubtotal(items);
  const shipping = 0; // Free shipping for MVP
  const total = subtotal + shipping;

  return (
    <div className="bg-background-card rounded-[--radius-card] p-6">
      <h2 className="font-heading text-xl text-primary mb-4">
        Votre commande
      </h2>

      {/* Items list */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3">
            {/* Product image */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-[--radius-button] overflow-hidden bg-background-secondary">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-primary truncate">
                {item.product.name}
              </h3>
              <p className="text-xs text-muted">
                Qte: {item.quantity}
              </p>
            </div>

            {/* Line total */}
            <div className="text-sm font-medium text-primary">
              {formatCartTotal(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t border-background-secondary pt-4">
        <div className="flex justify-between text-sm text-muted">
          <span>Sous-total</span>
          <span>{formatCartTotal(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted">
          <span>Livraison</span>
          <span className="text-green-600 font-medium">Gratuit</span>
        </div>
        <hr className="border-background-secondary" />
        <div className="flex justify-between font-medium text-lg text-primary">
          <span>Total</span>
          <span>{formatCartTotal(total)}</span>
        </div>
      </div>

      {/* Free shipping notice */}
      <div className="mt-4 p-3 bg-green-50 rounded-[--radius-button] text-center">
        <p className="text-sm text-green-700">
          Livraison offerte sur toutes les commandes
        </p>
      </div>
    </div>
  );
}
