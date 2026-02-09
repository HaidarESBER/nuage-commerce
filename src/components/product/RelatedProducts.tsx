"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { getProductRatingStats } from "@/data/reviews";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const { addItem } = useCart();
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollPosition();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScrollPosition);
      return () => ref.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    addItem(product);
    setAddedProducts((prev) => new Set(prev).add(product.id));

    // Remove added state after 2s
    setTimeout(() => {
      setAddedProducts((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section heading */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl text-primary mb-2">
            Vous aimerez aussi
          </h2>
          <p className="text-muted">Sélection basée sur ce produit</p>
        </div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center bg-background shadow-lg rounded-full text-primary hover:text-accent transition-colors"
              aria-label="Précédent"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Right arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center bg-background shadow-lg rounded-full text-primary hover:text-accent transition-colors"
              aria-label="Suivant"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Products carousel */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-4 lg:gap-6 pb-4">
              {products.map((product, index) => (
                <RelatedProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onAddToCart={handleAddToCart}
                  isAdded={addedProducts.has(product.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface RelatedProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isAdded: boolean;
}

function RelatedProductCard({
  product,
  index,
  onAddToCart,
  isAdded,
}: RelatedProductCardProps) {
  const stats = getProductRatingStats(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex-shrink-0 w-[280px] lg:w-[300px] snap-start"
    >
      <Link
        href={`/produits/${product.slug}`}
        className="group block bg-background rounded-[--radius-card] overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-square bg-background-secondary overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="300px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Quick add button */}
          <button
            onClick={(e) => onAddToCart(product, e)}
            className={`
              absolute bottom-3 right-3 w-10 h-10 rounded-full
              flex items-center justify-center transition-all duration-200
              ${
                isAdded
                  ? "bg-success text-background"
                  : "bg-background/90 text-primary hover:bg-accent hover:text-background"
              }
            `}
            aria-label={isAdded ? "Ajouté" : "Ajouter au panier"}
          >
            {isAdded ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Product name */}
          <h3 className="text-primary font-medium mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          {/* Rating */}
          {stats && stats.totalReviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(stats.averageRating)
                      ? "text-accent"
                      : "text-muted/30"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-sm text-muted ml-1">
                ({stats.totalReviews})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium text-primary">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
