"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { CartItem, CartSummary } from "@/components/cart";
import { useCart } from "@/contexts/CartContext";

/**
 * Cart page - /panier
 *
 * Displays cart contents with item list and order summary.
 * Uses client-side rendering for cart context.
 * Features staggered entrance and slide-out removal animations.
 */
export default function PanierPage() {
  const { items } = useCart();

  return (
    <main className="py-12 lg:py-16">
      <Container size="lg">
        <h1 className="text-3xl lg:text-4xl text-primary mb-8">
          Votre panier
        </h1>

        {items.length === 0 ? (
          <CartSummary />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-background-card rounded-[--radius-card] p-6">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CartItem item={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}

        {/* Trust Badges */}
        {items.length > 0 && (
          <div className="mt-12">
            <TrustBadges />
          </div>
        )}
      </Container>
    </main>
  );
}
