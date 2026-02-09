"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Order } from "@/types/order";
import { Button } from "@/components/ui";
import { OrderDetails } from "./OrderDetails";

interface OrderConfirmationProps {
  order: Order;
}

/**
 * OrderConfirmation component
 *
 * Displays order confirmation with:
 * - Success message with checkmark icon
 * - Confetti celebration on mount (brand colors)
 * - "Merci pour votre commande!" heading
 * - Order number prominently displayed
 * - OrderDetails component with full order information
 * - Email confirmation notice (informational, no actual email for MVP)
 * - "Continuer mes achats" button linking to /produits
 * - "Retour a l'accueil" secondary action
 *
 * @example
 * <OrderConfirmation order={order} />
 */
export function OrderConfirmation({ order }: OrderConfirmationProps) {
  useEffect(() => {
    // Dynamic import for confetti to reduce bundle size
    const triggerConfetti = async () => {
      try {
        const confetti = (await import("canvas-confetti")).default;

        // Fire confetti with brand colors (charcoal and blush)
        confetti({
          particleCount: 60,
          angle: 90,
          spread: 60,
          origin: { x: 0.5, y: 0 },
          colors: ["#2C2C2C", "#D4A5A5"], // Charcoal and Blush brand colors
          gravity: 0.8,
          decay: 0.91,
          scalar: 1,
        });
      } catch (error) {
        // Fail gracefully if confetti doesn't load
        console.error("Failed to load confetti:", error);
      }
    };

    triggerConfetti();
  }, []);

  return (
    <div className="space-y-8">
      {/* Success header */}
      <div className="text-center">
        <motion.div
          className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              delay: 0.1,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </motion.div>
        </motion.div>
        <h1 className="font-heading text-3xl text-primary mb-2">
          Merci pour votre commande !
        </h1>
        <p className="text-lg text-primary font-medium mb-2">
          Commande {order.orderNumber}
        </p>
        <p className="text-muted">
          Un email de confirmation a ete envoye a{" "}
          <span className="font-medium text-primary">
            {order.shippingAddress.email}
          </span>
        </p>
      </div>

      {/* Order details */}
      <OrderDetails order={order} />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/produits">
          <Button variant="primary" size="md">
            Continuer mes achats
          </Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" size="md">
            Retour a l&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
