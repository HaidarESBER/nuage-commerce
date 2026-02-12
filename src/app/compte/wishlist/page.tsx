"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { RecommendationsSection } from "@/components/product/RecommendationsSection";
import { Product } from "@/types/product";
import { WishlistResponse } from "@/types/wishlist";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");

      if (response.status === 401) {
        // Not authenticated - redirect to login
        router.push("/compte/connexion");
        return;
      }

      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la liste de souhaits");
      }

      const data: WishlistResponse = await response.json();
      setWishlistItems(data.items.map(item => item.product));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Impossible de charger votre liste de souhaits");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container size="lg" className="py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-blush border-t-transparent"></div>
          <p className="mt-4 text-muted">Chargement...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" className="py-16">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <button
            onClick={fetchWishlist}
            className="mt-4 px-6 py-2 bg-accent-blush text-white rounded-full hover:bg-accent-blush/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg" className="py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4">
          Ma Liste de Souhaits
        </h1>
        <p className="text-muted text-lg">
          {wishlistItems.length > 0
            ? `${wishlistItems.length} ${wishlistItems.length === 1 ? "produit" : "produits"} dans votre liste`
            : "Votre liste de souhaits est vide"}
        </p>
      </motion.div>

      {/* Empty State */}
      {wishlistItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <svg
            className="mx-auto h-24 w-24 text-muted/50 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <h2 className="font-heading text-2xl text-primary mb-4">
            Votre liste est vide
          </h2>
          <p className="text-muted mb-8">
            Parcourez notre catalogue et ajoutez vos produits favoris
          </p>
          <button
            onClick={() => router.push("/produits")}
            className="px-8 py-3 bg-accent-blush text-white rounded-full hover:bg-accent-blush/90 transition-all hover:scale-105 font-medium"
          >
            Découvrir nos produits
          </button>
        </motion.div>
      )}

      {/* Products Grid */}
      {wishlistItems.length > 0 && (
        <>
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Recommendations based on wishlist */}
          <RecommendationsSection
            title="Basé sur vos favoris"
            subtitle="Produits similaires que vous pourriez aimer"
            limit={6}
          />
        </>
      )}
    </Container>
  );
}
