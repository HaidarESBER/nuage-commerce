import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container, Button } from "@/components/ui";
import { getOrderByNumber } from "@/lib/orders";
import { formatCartTotal } from "@/types/cart";
import { orderStatusLabels } from "@/types/order";

interface ConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

/**
 * Order confirmation page
 *
 * Displays order details after successful checkout:
 * - Order number
 * - Shipping address
 * - Items ordered
 * - Totals
 * - Next steps
 */
export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <Container as="main" size="lg" className="py-12">
      {/* Success header */}
      <div className="text-center mb-12">
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
          Commande confirmee !
        </h1>
        <p className="text-muted text-lg">
          Merci pour votre commande. Nous vous enverrons un email de confirmation.
        </p>
      </div>

      {/* Order info */}
      <div className="bg-background-card rounded-[--radius-card] p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <p className="text-sm text-muted">Numero de commande</p>
            <p className="font-heading text-xl text-primary">{order.orderNumber}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted">Statut</p>
            <p className="font-medium text-primary">
              {orderStatusLabels[order.status]}
            </p>
          </div>
        </div>

        {/* Shipping address */}
        <div className="border-t border-background-secondary pt-6 mb-6">
          <h2 className="font-heading text-lg text-primary mb-3">
            Adresse de livraison
          </h2>
          <address className="text-muted not-italic">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            <br />
            {order.shippingAddress.address}
            {order.shippingAddress.addressLine2 && (
              <>
                <br />
                {order.shippingAddress.addressLine2}
              </>
            )}
            <br />
            {order.shippingAddress.postalCode} {order.shippingAddress.city}
            <br />
            {order.shippingAddress.country}
            <br />
            <br />
            {order.shippingAddress.email}
            <br />
            {order.shippingAddress.phone}
          </address>
        </div>

        {/* Order items */}
        <div className="border-t border-background-secondary pt-6">
          <h2 className="font-heading text-lg text-primary mb-4">
            Articles commandes
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-4">
                {/* Product image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-[--radius-button] overflow-hidden bg-background-secondary">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
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
                  <h3 className="font-medium text-primary">{item.productName}</h3>
                  <p className="text-sm text-muted">Quantite: {item.quantity}</p>
                  <p className="text-sm text-muted">
                    Prix unitaire: {formatCartTotal(item.price)}
                  </p>
                </div>

                {/* Line total */}
                <div className="text-right">
                  <p className="font-medium text-primary">
                    {formatCartTotal(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-background-secondary mt-6 pt-4 space-y-2">
            <div className="flex justify-between text-muted">
              <span>Sous-total</span>
              <span>{formatCartTotal(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Livraison</span>
              <span className="text-green-600 font-medium">Gratuit</span>
            </div>
            <div className="flex justify-between font-medium text-lg text-primary pt-2 border-t border-background-secondary">
              <span>Total</span>
              <span>{formatCartTotal(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="border-t border-background-secondary pt-6 mt-6">
            <h2 className="font-heading text-lg text-primary mb-2">
              Notes
            </h2>
            <p className="text-muted">{order.notes}</p>
          </div>
        )}
      </div>

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
    </Container>
  );
}
