"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import { CheckoutForm } from "@/components/checkout";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/orders";
import { CheckoutFormData } from "@/types/checkout";
import { OrderItem } from "@/types/order";
import { calculateSubtotal } from "@/types/cart";

/**
 * Checkout page for completing purchases
 *
 * Features:
 * - Redirects to cart if empty
 * - Collects shipping information
 * - Creates order on submission
 * - Clears cart and redirects to confirmation
 */
export default function CheckoutPage() {
  const { items, clearCart } = useCart();
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

      const subtotal = calculateSubtotal(items);
      const shipping = formData.shippingCost; // Use actual shipping cost from form
      const total = subtotal + shipping;

      // Create order
      const order = await createOrder({
        items: orderItems,
        subtotal,
        shipping,
        total,
        shippingAddress: formData.shippingAddress,
        notes: formData.notes,
      });

      // Send order confirmation email (non-blocking)
      // Don't await - let email send in background
      fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      }).catch((error) => {
        // Log error but don't block user experience
        console.error("Failed to send confirmation email:", error);
      });

      // Clear cart after successful order
      clearCart();

      // Redirect to confirmation page
      router.push(`/commande/confirmation/${order.orderNumber}`);
    } catch (error) {
      console.error("Order creation failed:", error);
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
