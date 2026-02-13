"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import { CheckoutForm } from "@/components/checkout";
import { useCart } from "@/contexts/CartContext";
import { CheckoutFormData } from "@/types/checkout";
import { OrderItem } from "@/types/order";
import { getVisitorId } from "@/lib/referral";

/**
 * Checkout page for completing purchases
 *
 * Features:
 * - Redirects to cart if empty
 * - Collects shipping information
 * - Calls checkout API to create Stripe Checkout Session
 * - Redirects to Stripe for payment
 */
export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to cart if empty (but not while submitting order)
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push("/panier");
    }
  }, [items.length, router, isSubmitting]);

  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // Convert cart items to order items
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || "",
        price: item.product.price,
        quantity: item.quantity,
      }));

      // Get visitor ID for referral tracking
      const visitorId = getVisitorId();

      // Call checkout API to create Stripe Checkout Session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: formData.shippingAddress,
          shippingCost: formData.shippingCost,
          notes: formData.notes,
          visitorId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du paiement");
      }

      // Redirect to Stripe Checkout
      // Cart will be cleared on the confirmation page after successful payment
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsSubmitting(false);
      throw error;
    }
  };

  // Don't render if cart is empty (will redirect)
  if (items.length === 0) {
    return (
      <Container as="main" size="xl" className="py-12">
        <div className="text-center py-12">
          <p className="text-muted">Redirection vers le panier...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container as="main" size="xl" className="py-12">
      <h1 className="font-heading text-3xl text-primary mb-8">
        Finaliser votre commande
      </h1>
      <CheckoutForm items={items} onSubmit={handleSubmit} />
    </Container>
  );
}
