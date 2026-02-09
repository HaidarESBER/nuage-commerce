"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { SwipeableGallery } from "@/components/product/SwipeableGallery";
import { ProductReviews } from "@/components/product/ProductReviews";
import { Product, formatPrice, categoryLabels } from "@/types/product";
import { getProductReviews, getProductRatingStats } from "@/data/reviews";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  // Get reviews data
  const reviews = getProductReviews(product.id);
  const stats = getProductRatingStats(product.id);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomOpen) {
        setIsZoomOpen(false);
      }
      if (isZoomOpen && product.images.length > 1) {
        if (e.key === "ArrowLeft") {
          setSelectedImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
          );
        }
        if (e.key === "ArrowRight") {
          setSelectedImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, product.images.length]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isZoomOpen]);

  const openZoom = () => setIsZoomOpen(true);
  const closeZoom = () => setIsZoomOpen(false);

  const navigatePrev = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const navigateNext = () => {
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="py-12 lg:py-16">
      <Container size="lg">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/produits" className="hover:text-primary transition-colors">
                Produits
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/produits?categorie=${product.category}`}
                className="hover:text-primary transition-colors"
              >
                {categoryLabels[product.category]}
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary">{product.name}</li>
          </ol>
        </nav>

        {/* Two-column layout on desktop */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image section - sticky on desktop */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {isMobile ? (
              /* Mobile: Swipeable gallery */
              <div className="relative">
                <SwipeableGallery
                  images={product.images}
                  productName={product.name}
                  onImageClick={openZoom}
                />
                {/* Sale badge */}
                {hasDiscount && (
                  <div className="absolute top-8 left-4 bg-error text-background text-sm font-medium px-3 py-1.5 rounded z-10">
                    Promo
                  </div>
                )}
              </div>
            ) : (
              /* Desktop: Click gallery with thumbnails */
              <>
                {/* Main image with fade transition */}
                <button
                  onClick={openZoom}
                  className="relative aspect-square bg-background-secondary rounded-[--radius-card] overflow-hidden mb-4 w-full cursor-zoom-in"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={product.images[selectedImageIndex]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        priority={selectedImageIndex === 0}
                      />
                    </motion.div>
                  </AnimatePresence>
                  {/* Sale badge */}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-error text-background text-sm font-medium px-3 py-1.5 rounded">
                      Promo
                    </div>
                  )}
                </button>

                {/* Image gallery thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`
                          relative w-20 h-20 flex-shrink-0 rounded-[--radius-button] overflow-hidden
                          border-2 ${index === selectedImageIndex ? "border-accent" : "border-transparent hover:border-muted"}
                          transition-colors
                        `}
                        title={`Image ${index + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Details section */}
          <div>
            {/* Product name */}
            <h1 className="text-3xl lg:text-4xl text-primary mb-4">
              {product.name}
            </h1>

            {/* Price display */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl lg:text-3xl font-medium text-primary">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="text-muted text-lg mb-6">{product.shortDescription}</p>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.inStock ? "bg-success" : "bg-error"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  product.inStock ? "text-success" : "text-error"
                }`}
              >
                {product.inStock ? "Stock disponible" : "Rupture de stock"}
              </span>
            </div>

            {/* Add to cart button */}
            <div className="mb-8">
              <AddToCartButton product={product} />
            </div>

            {/* Divider */}
            <hr className="border-background-secondary mb-8" />

            {/* Full description */}
            <div>
              <h2 className="text-xl text-primary mb-4">Description</h2>
              <div className="prose prose-neutral max-w-none">
                <p className="text-text leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Category link */}
            <div className="mt-8 pt-8 border-t border-background-secondary">
              <p className="text-sm text-muted">
                Catégorie:{" "}
                <Link
                  href={`/produits?categorie=${product.category}`}
                  className="text-primary hover:text-accent transition-colors"
                >
                  {categoryLabels[product.category]}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t border-background-secondary pt-12">
          <ProductReviews reviews={reviews} stats={stats} />
        </div>
      </Container>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90"
            onClick={closeZoom}
          >
            {/* Close button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-background hover:text-accent transition-colors z-10"
              aria-label="Close zoom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation arrows for multiple images */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePrev();
                  }}
                  className="absolute left-4 w-12 h-12 flex items-center justify-center text-background hover:text-accent transition-colors z-10"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateNext();
                  }}
                  className="absolute right-4 w-12 h-12 flex items-center justify-center text-background hover:text-accent transition-colors z-10"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Zoomed image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
