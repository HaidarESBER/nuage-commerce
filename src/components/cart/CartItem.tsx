"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
}

/**
 * CartItem component displays a single item in the cart
 *
 * Features:
 * - Product image (80x80)
 * - Product name and price
 * - Quantity controls (+/-)
 * - Remove button
 * - Responsive: stack on mobile, row on desktop
 * - Layout animations for smooth reordering
 */
export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  return (
    <motion.div
      layout
      className="flex flex-col sm:flex-row gap-4 py-4 border-b border-background-secondary last:border-b-0"
    >
      {/* Product image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-background-secondary rounded-[--radius-card] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Product info and controls */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Name and price */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-primary text-base line-clamp-1">
            {product.name}
          </h3>
          <p className="text-muted text-sm mt-1">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center border border-primary rounded-[--radius-button] text-primary hover:bg-primary hover:text-background transition-colors"
            aria-label="Diminuer la quantite"
          >
            <span className="text-lg leading-none">-</span>
          </button>
          <span className="w-8 text-center font-medium text-primary">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center border border-primary rounded-[--radius-button] text-primary hover:bg-primary hover:text-background transition-colors"
            aria-label="Augmenter la quantite"
          >
            <span className="text-lg leading-none">+</span>
          </button>
        </div>

        {/* Line total */}
        <div className="text-right sm:w-24">
          <p className="font-medium text-primary">
            {formatPrice(product.price * quantity)}
          </p>
        </div>

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="text-muted hover:text-error transition-colors sm:ml-2"
          aria-label="Supprimer du panier"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
