"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/types/product";
import { calculateSubtotal, calculateTotalItems } from "@/types/cart";

export default function PanierPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const upsellScrollRef = useRef<HTMLDivElement>(null);

  const totalItems = calculateTotalItems(items);
  const subtotal = calculateSubtotal(items);
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Get some related products for upsell (mock data for now)
  const upsellProducts = [
    {
      id: "upsell-1",
      name: "Charbon Naturel 1kg",
      description: "Premium Coconut",
      price: 890,
      image: "/images/products/charbon.jpg"
    },
    {
      id: "upsell-2",
      name: "Embouts Hygiéniques",
      description: "Pack de 50",
      price: 450,
      image: "/images/products/embouts.jpg"
    },
    {
      id: "upsell-3",
      name: "Aluminium Premium",
      description: "Ultra-résistant",
      price: 690,
      image: "/images/products/aluminium.jpg"
    },
  ];

  const handleApplyPromo = () => {
    // Simple promo code validation
    const validCodes: Record<string, number> = {
      "WELCOME10": 10, // 10% off
      "SAVE20": 20,    // 20% off
    };

    const code = promoCode.toUpperCase();
    if (validCodes[code]) {
      const discountPercent = validCodes[code];
      const discountAmount = Math.floor(subtotal * (discountPercent / 100));
      setDiscount(discountAmount);
      setPromoError("");
    } else {
      setPromoError("Code promo invalide");
      setDiscount(0);
    }
  };

  return (
    <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 bg-background-dark text-white min-h-screen">
      <h1 className="text-2xl md:text-3xl font-light mb-6 text-white">
        Mon Panier <span className="text-gray-400 text-lg md:text-xl ml-2 font-thin">({totalItems} article{totalItems > 1 ? 's' : ''})</span>
      </h1>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-surface-dark flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-4xl text-gray-400">shopping_cart</span>
          </div>
          <h2 className="text-xl text-white mb-2">Votre panier est vide</h2>
          <p className="text-gray-400 mb-8">Découvrez nos produits et trouvez votre bonheur</p>
          <Link
            href="/produits"
            className="inline-block px-8 py-4 bg-primary hover:bg-primary-light text-background-dark font-bold rounded-full transition-all shadow-[0_0_20px_rgba(18,222,38,0.3)] hover:shadow-[0_0_30px_rgba(18,222,38,0.5)]"
          >
            Voir nos produits
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Left Column: Cart Items & Upsell */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Cart Items List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-surface-dark/40 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative group hover:border-primary/30 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-full sm:w-[100px] h-[100px] shrink-0 rounded-lg overflow-hidden bg-background-dark">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow flex flex-col md:flex-row justify-between gap-4 w-full">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-medium text-white">{item.product.name}</h3>
                        <p className="text-xs text-gray-400">{item.product.shortDescription}</p>
                        <p className="text-xs text-primary">En stock</p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-8 mt-2 md:mt-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-white/20 rounded-lg">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.product.id, item.quantity - 1);
                              } else {
                                removeItem(item.product.id);
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                          >
                            <span className="material-icons text-base">remove</span>
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                          >
                            <span className="material-icons text-base">add</span>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[70px]">
                          <p className="text-base font-semibold text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-gray-400">
                              {formatPrice(item.product.price)} / unité
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      aria-label="Supprimer"
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <span className="material-icons-outlined">close</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Upsell Carousel Section */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-light text-white">Complétez votre session</h2>
                  <p className="text-sm text-gray-400 mt-1">Les essentiels recommandés par nos experts</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => upsellScrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' })}
                    className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
                  >
                    <span className="material-icons text-sm">arrow_back</span>
                  </button>
                  <button
                    onClick={() => upsellScrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' })}
                    className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
                  >
                    <span className="material-icons text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div ref={upsellScrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
                {upsellProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-surface-dark/40 backdrop-blur-md border border-white/10 min-w-[200px] w-[200px] rounded-xl p-3 flex flex-col gap-3 snap-center hover:translate-y-[-4px] hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-full aspect-square rounded-lg bg-background-dark overflow-hidden relative">
                      <div className="w-full h-full bg-gradient-to-br from-surface-dark to-background-dark"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
                        <button className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all">
                          <span className="material-icons text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              <div className="bg-surface-dark/40 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-light text-white mb-6 pb-4 border-b border-white/10">Résumé</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Sous-total</span>
                    <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary">Réduction</span>
                      <span className="font-medium text-primary">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Livraison estimée</span>
                    <span className="text-gray-500 italic text-xs">Calculé à l'étape suivante</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Taxes</span>
                    <span className="font-medium text-white">Incluses</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleApplyPromo();
                      }}
                      className="w-full bg-background-dark/50 border border-white/20 rounded-lg py-2.5 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white placeholder-gray-500"
                      placeholder="Code promo (ex: WELCOME10)"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:text-white transition-colors px-2 py-1"
                    >
                      APPLIQUER
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-400 text-xs mt-2">{promoError}</p>
                  )}
                  {discount > 0 && (
                    <p className="text-primary text-xs mt-2">✓ Code promo appliqué !</p>
                  )}
                </div>

                <div className="flex justify-between items-end mb-8 pt-6 border-t border-white/10">
                  <span className="text-base font-medium text-white">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-semibold text-primary">{formatPrice(subtotal - discount)}</span>
                  </div>
                </div>

                <Link
                  href="/commande"
                  className="block w-full bg-primary hover:bg-primary-light text-background-dark font-medium py-4 px-6 rounded-lg transition-all transform active:scale-[0.99] shadow-[0_0_20px_rgba(18,222,38,0.3)] hover:shadow-[0_0_25px_rgba(18,222,38,0.5)] text-center"
                >
                  Procéder au Paiement
                </Link>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 text-gray-500">
                    <span className="material-icons-outlined text-xl">verified_user</span>
                    <span className="material-icons-outlined text-xl">local_shipping</span>
                    <span className="material-icons-outlined text-xl">replay</span>
                  </div>
                  <p className="text-xs text-center text-gray-600">
                    Paiement sécurisé. Retours gratuits sous 30 jours.
                  </p>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-surface-dark/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <span className="material-icons-outlined">support_agent</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Besoin d'aide ?</p>
                  <p className="text-xs text-gray-400">Contactez notre support au 01 23 45 67 89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
