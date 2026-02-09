import Link from "next/link";
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
  return (
    <div className="space-y-8">
      {/* Success header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
        </div>
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
