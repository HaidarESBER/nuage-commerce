"use client";

import { Container } from "@/components/ui";
import { CartItem, CartSummary } from "@/components/cart";
import { useCart } from "@/contexts/CartContext";

/**
 * Cart page - /panier
 *
 * Displays cart contents with item list and order summary.
 * Uses client-side rendering for cart context.
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
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
