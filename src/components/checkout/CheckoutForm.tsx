"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { ShippingForm } from "./ShippingForm";
import { OrderSummary } from "./OrderSummary";
import { CartItem } from "@/types/cart";
import {
  ShippingAddress,
  CheckoutFormData,
  defaultShippingAddress,
  isValidEmail,
  isValidFrenchPostalCode,
  isValidPhone,
} from "@/types/checkout";

interface CheckoutFormProps {
  items: CartItem[];
  onSubmit: (data: CheckoutFormData) => Promise<void>;
}

type FieldErrors = Partial<Record<keyof ShippingAddress, string>>;

/**
 * CheckoutForm orchestrates the checkout flow
 *
 * Features:
 * - Two-column layout on desktop (form + summary)
 * - Stacked on mobile (summary first)
 * - Client-side validation
 * - Loading state during submission
 */
export function CheckoutForm({ items, onSubmit }: CheckoutFormProps) {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(
    defaultShippingAddress
  );
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = useCallback((): boolean => {
    const newErrors: FieldErrors = {};

    // Required fields validation
    if (!shippingAddress.firstName.trim()) {
      newErrors.firstName = "Le prenom est requis";
    }
    if (!shippingAddress.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!shippingAddress.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!isValidEmail(shippingAddress.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = "Le telephone est requis";
    } else if (!isValidPhone(shippingAddress.phone)) {
      newErrors.phone = "Le numero de telephone n'est pas valide";
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = "La ville est requise";
    }
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    } else if (!isValidFrenchPostalCode(shippingAddress.postalCode)) {
      newErrors.postalCode = "Le code postal doit contenir 5 chiffres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [shippingAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        shippingAddress,
        notes: notes.trim() || undefined,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la commande"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order summary on mobile (shown first) */}
        <div className="lg:hidden">
          <OrderSummary items={items} />
        </div>

        {/* Shipping form (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, staggerChildren: 0.05 }}
          >
            <ShippingForm
              address={shippingAddress}
              onChange={setShippingAddress}
              errors={errors}
            />
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-primary mb-1"
            >
              Notes pour la commande (optionnel)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-[--radius-button] border border-background-secondary bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Instructions speciales pour la livraison..."
            />
          </motion.div>

          {/* Submit error */}
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-[--radius-button] text-red-700">
              {submitError}
            </div>
          )}

          {/* Submit button */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              <motion.span
                animate={{ opacity: isSubmitting ? 0.7 : 1 }}
                transition={{ duration: 0.2 }}
                className={isSubmitting ? "flex items-center justify-center gap-2" : ""}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Traitement en cours...
                  </>
                ) : (
                  "Confirmer la commande"
                )}
              </motion.span>
            </Button>
          </motion.div>

          <p className="text-xs text-muted text-center">
            En confirmant votre commande, vous acceptez nos conditions generales de vente.
          </p>
        </div>

        {/* Order summary on desktop (1/3 width, right side) */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <OrderSummary items={items} />
          </div>
        </div>
      </div>
    </form>
  );
}
