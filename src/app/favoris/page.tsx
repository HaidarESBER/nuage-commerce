"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/data/products";

// Disable static generation for this page as it requires client-side context
export const dynamic = "force-dynamic";

export default function FavorisPage() {
  const { wishlistItems } = useWishlist();

  // Get full product data for wishlist items
  const wishlistProducts = products.filter((product) =>
    wishlistItems.includes(product.id)
  );

  return (
    <main className="py-12 lg:py-16">
      <Container size="lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl text-primary mb-2">
            Vos favoris
          </h1>
          <p className="text-muted">
            {wishlistProducts.length > 0
              ? `${wishlistProducts.length} produit${wishlistProducts.length > 1 ? "s" : ""} dans votre liste de souhaits`
              : "Aucun produit dans vos favoris"}
          </p>
        </div>

        {/* Wishlist content */}
        {wishlistProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {wishlistProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            {/* Heart icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="mb-6"
            >
              <svg
                className="w-24 h-24 text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </motion.div>

            {/* Empty message */}
            <h2 className="text-2xl text-primary mb-3">
              Aucun produit dans vos favoris
            </h2>
            <p className="text-muted mb-8 max-w-md">
              Découvrez notre catalogue et ajoutez vos produits préférés à votre liste de souhaits
            </p>

            {/* CTA button */}
            <Link
              href="/produits"
              className="inline-flex items-center px-6 py-3 bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors font-medium"
            >
              Découvrir les produits
            </Link>
          </motion.div>
        )}
      </Container>
    </main>
  );
}
