"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/types/product";
import { calculateSubtotal, calculateTotalItems } from "@/types/cart";
import { OrderItem } from "@/types/order";

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    zip: "",
    city: "",
    phone: "",
    saveInfo: false,
  });

  const totalItems = calculateTotalItems(items);
  const subtotal = calculateSubtotal(items);
  const shippingCost = shippingMethod === "express" ? 990 : 0;
  const total = subtotal + shippingCost;

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push("/panier");
    }
  }, [items.length, router, isSubmitting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinue = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Submit order
    setIsSubmitting(true);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || "",
        price: item.product.price,
        quantity: item.quantity,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            zip: formData.zip,
            phone: formData.phone,
          },
          shippingCost,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du paiement");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsSubmitting(false);
    }
  };

  // Don't render if cart is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-background-dark text-gray-200 antialiased min-h-screen flex flex-col pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <Link
          href="/panier"
          className="text-gray-300 hover:text-primary transition-colors p-1"
        >
          <span className="material-icons-outlined text-2xl">arrow_back</span>
        </Link>
        <div className="text-xl font-bold tracking-widest uppercase text-primary">NUAGE</div>
        <Link
          href="/panier"
          className="relative text-gray-300 hover:text-primary transition-colors p-1"
        >
          <span className="material-icons-outlined text-2xl">shopping_bag</span>
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 bg-primary text-black text-[10px] font-bold flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 pt-6 max-w-lg mx-auto w-full">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/10 -z-10 transform -translate-y-1/2"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              currentStep >= 1
                ? "bg-primary text-background-dark shadow-[0_0_15px_rgba(18,222,38,0.3)]"
                : "bg-surface-dark border-2 border-white/20 text-gray-400"
            }`}>
              1
            </div>
            <span className={`text-xs font-medium mt-2 uppercase tracking-wide ${
              currentStep >= 1 ? "text-primary" : "text-gray-400"
            }`}>
              Livraison
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              currentStep >= 2
                ? "bg-primary text-background-dark shadow-[0_0_15px_rgba(18,222,38,0.3)]"
                : "bg-surface-dark border-2 border-white/20 text-gray-400"
            }`}>
              2
            </div>
            <span className={`text-xs font-medium mt-2 uppercase tracking-wide ${
              currentStep >= 2 ? "text-primary" : "text-gray-400"
            }`}>
              Paiement
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              currentStep >= 3
                ? "bg-primary text-background-dark shadow-[0_0_15px_rgba(18,222,38,0.3)]"
                : "bg-surface-dark border-2 border-white/20 text-gray-400"
            }`}>
              3
            </div>
            <span className={`text-xs font-medium mt-2 uppercase tracking-wide ${
              currentStep >= 3 ? "text-primary" : "text-gray-400"
            }`}>
              Confirm
            </span>
          </div>
        </div>

        {/* Order Summary Accordion */}
        <div className="mb-8 rounded-xl bg-surface-dark border border-white/5 overflow-hidden">
          <details className="group">
            <summary className="flex justify-between items-center p-4 cursor-pointer list-none select-none">
              <div className="flex items-center gap-3">
                <span className="material-icons-outlined text-primary group-open:rotate-180 transition-transform">
                  expand_more
                </span>
                <div className="text-sm font-medium">
                  Récapitulatif ({totalItems} article{totalItems > 1 ? 's' : ''})
                </div>
              </div>
              <div className="font-bold text-primary">{formatPrice(total)}</div>
            </summary>
            <div className="px-4 pb-4 pt-0 border-t border-white/5">
              {items.map((item, index) => (
                <div
                  key={item.product.id}
                  className={`flex gap-4 py-4 ${index < items.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="h-16 w-16 bg-background-dark rounded-lg flex-shrink-0 relative overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <span className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                      x{item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-100">{item.product.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">{item.product.shortDescription}</p>
                  </div>
                  <div className="text-sm font-bold text-gray-200">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Shipping Form */}
        {currentStep === 1 && (
          <>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-primary text-xl">local_shipping</span>
              Adresse de livraison
            </h2>
            <form className="space-y-4 mb-8">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1" htmlFor="firstName">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1" htmlFor="lastName">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1" htmlFor="address">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="12 Rue de Rivoli"
                />
              </div>

              {/* Address 2 */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1" htmlFor="address2">
                  Complément (Optionnel)
                </label>
                <input
                  type="text"
                  id="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Appartement, code, étage..."
                />
              </div>

              {/* City Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1" htmlFor="zip">
                    Code Postal
                  </label>
                  <input
                    type="text"
                    id="zip"
                    inputMode="numeric"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="75001"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1" htmlFor="city">
                    Ville
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Paris"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              {/* Save checkbox */}
              <div className="flex items-center gap-3 pt-2 pb-6">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/20 bg-surface-dark checked:border-primary checked:bg-primary transition-all"
                  />
                  <span className="material-icons-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-black opacity-0 peer-checked:opacity-100 pointer-events-none">
                    check
                  </span>
                </div>
                <label className="text-sm text-gray-400 select-none cursor-pointer" htmlFor="saveInfo">
                  Sauvegarder pour la prochaine fois
                </label>
              </div>
            </form>

            {/* Shipping Method */}
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-primary text-xl">local_offer</span>
              Mode de livraison
            </h2>
            <div className="space-y-3 mb-8">
              {/* Standard */}
              <label className={`relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                shippingMethod === "standard"
                  ? "border-primary bg-primary/5"
                  : "border-white/10 bg-surface-dark hover:border-primary/50"
              }`}>
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="peer h-5 w-5 appearance-none rounded-full border border-white/30 checked:border-primary checked:bg-primary"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Colissimo Standard</div>
                    <div className="text-xs text-gray-400 mt-0.5">3-5 jours ouvrés</div>
                  </div>
                </div>
                <div className="font-bold text-primary">Gratuit</div>
              </label>

              {/* Express */}
              <label className={`relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                shippingMethod === "express"
                  ? "border-primary bg-primary/5"
                  : "border-white/10 bg-surface-dark hover:border-primary/50"
              }`}>
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="peer h-5 w-5 appearance-none rounded-full border border-white/30 checked:border-primary checked:bg-primary"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Chronopost Express</div>
                    <div className="text-xs text-gray-400 mt-0.5">Demain avant 13h</div>
                  </div>
                </div>
                <div className="font-bold text-white">9.90 €</div>
              </label>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <div className="text-center py-12">
            <span className="material-icons-outlined text-6xl text-primary mb-4">credit_card</span>
            <h2 className="text-2xl font-bold text-white mb-2">Paiement sécurisé</h2>
            <p className="text-gray-400">Cliquez sur Continuer pour procéder au paiement</p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center py-12">
            <span className="material-icons-outlined text-6xl text-primary mb-4">check_circle</span>
            <h2 className="text-2xl font-bold text-white mb-2">Confirmation</h2>
            <p className="text-gray-400">Vérifiez votre commande avant de finaliser</p>
          </div>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark/95 backdrop-blur-xl border-t border-white/5 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Total</span>
            <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
          </div>
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-light text-black font-bold py-3.5 px-8 rounded-xl shadow-[0_4px_14px_rgba(18,222,38,0.4)] transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? "Chargement..." : "Continuer"}</span>
            <span className="material-icons-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
