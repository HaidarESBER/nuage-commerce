"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { SwipeableGallery } from "@/components/product/SwipeableGallery";
import { ProductReviews } from "@/components/product/ProductReviews";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { StockIndicator } from "@/components/product/StockIndicator";
import { ImageZoom } from "@/components/product/ImageZoom";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Product, formatPrice, categoryLabels } from "@/types/product";
import { Review, ProductRatingStats } from "@/data/reviews";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getRelatedProducts } from "@/lib/recommendations";
import { UrgencyIndicators } from "@/components/product/UrgencyIndicators";

interface ProductDetailClientProps {
  product: Product;
  allProducts: Product[];
  reviews: Review[];
  stats: ProductRatingStats | null;
}

type TabType = "description" | "reviews" | "shipping";

export function ProductDetailClient({ product, allProducts, reviews, stats }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [isMobile, setIsMobile] = useState(false);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  // Get related products
  const relatedProducts = getRelatedProducts(product, allProducts);

  // Consolidated effects for better performance
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

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

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = isZoomOpen ? "hidden" : "";

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isZoomOpen, product.images.length]);

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
    <main className="py-6 lg:py-10">
      <Container size="lg">
        {/* Breadcrumb */}
        <nav className="mb-6">
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
            <li className="text-primary truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Hero Image Section - Clean, High Quality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 md:mb-10 max-w-6xl mx-auto"
        >
          {/* Sale badge */}
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-error text-white text-sm font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
              -{discountPercentage}%
            </div>
          )}

          {/* Main Product Image - High Quality Display */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#F7F5F3] to-[#E8E4DF] cursor-pointer group shadow-xl p-6 md:p-8 lg:p-6">
            <div className="relative w-full aspect-square lg:aspect-[16/9]">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-contain hover:scale-105 transition-transform duration-500"
                priority
                quality={100}
                onClick={openZoom}
              />
            </div>
          </div>

          {/* Thumbnail Navigation - Below Image */}
          {product.images.length > 1 && (
            <div className="flex justify-center gap-3 mt-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`
                    relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden
                    border-2 transition-all duration-300
                    ${index === selectedImageIndex
                      ? "border-[#D4A5A5] shadow-lg scale-105"
                      : "border-border hover:border-muted opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info Section - Clean Layout */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12 mb-12 md:mb-16">
          {/* Left: Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Product Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary mb-4 font-light tracking-wide">
              {product.name}
            </h1>

            {/* Rating & Category */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-border">
              {stats && stats.averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(stats.averageRating)
                            ? "text-amber-400 fill-current"
                            : "text-border"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-muted">
                    {stats.averageRating.toFixed(1)} ({stats.totalReviews} avis)
                  </span>
                </div>
              )}
              <span className="text-sm tracking-wider uppercase text-[#D4A5A5] font-medium">
                {categoryLabels[product.category]}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-text text-lg leading-relaxed mb-6">
              {product.shortDescription}
            </p>
          </motion.div>

          {/* Right: Buy Box - Sticky */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:sticky lg:top-6 lg:self-start"
          >
            <div className="bg-background-secondary/50 border border-border rounded-2xl p-6 md:p-7">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-muted line-through">
                      {formatPrice(product.compareAtPrice!)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">TVA incluse</p>
              </div>

              {/* Stock & Urgency */}
              <div className="mb-6 space-y-3 pb-6 border-b border-border">
                <StockIndicator
                  inStock={product.inStock}
                  stockLevel={product.stockLevel}
                  size="sm"
                />
                <UrgencyIndicators product={product} />
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                <AddToCartButton product={product} />
                <WishlistButton
                  productId={product.id}
                  size="md"
                  showLabel={true}
                  className="w-full justify-center text-primary hover:text-[#D4A5A5] transition-colors border border-border rounded-lg py-2.5 hover:bg-background-secondary/50"
                />
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-border">
                <TrustBadges />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12 md:mb-16">
          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="flex justify-center gap-8 lg:gap-12">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 px-2 text-sm lg:text-base font-medium transition-all duration-300 border-b-2 ${
                  activeTab === "description"
                    ? "border-amber-400 text-primary"
                    : "border-transparent text-muted hover:text-primary"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 px-2 text-sm lg:text-base font-medium transition-all duration-300 border-b-2 ${
                  activeTab === "reviews"
                    ? "border-amber-400 text-primary"
                    : "border-transparent text-muted hover:text-primary"
                }`}
              >
                Avis {stats && `(${stats.totalReviews})`}
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-4 px-2 text-sm lg:text-base font-medium transition-all duration-300 border-b-2 ${
                  activeTab === "shipping"
                    ? "border-amber-400 text-primary"
                    : "border-transparent text-muted hover:text-primary"
                }`}
              >
                Livraison
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px] max-w-4xl mx-auto">
            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="prose prose-lg prose-neutral max-w-none">
                  <p className="text-text text-lg leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <ProductReviews reviews={reviews} stats={stats} />
              </motion.div>
            )}

            {activeTab === "shipping" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Livraison Standard</h3>
                      <p className="text-sm text-muted">Livraison en 3-5 jours ouvrés</p>
                      <p className="text-sm font-medium text-primary mt-1">5,99€</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Livraison Express</h3>
                      <p className="text-sm text-muted">Livraison en 24-48h</p>
                      <p className="text-sm font-medium text-primary mt-1">12,99€</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Retours Gratuits</h3>
                      <p className="text-sm text-muted">30 jours pour changer d'avis</p>
                      <p className="text-sm font-medium text-accent mt-1">Gratuit</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Garantie</h3>
                      <p className="text-sm text-muted">2 ans de garantie constructeur</p>
                      <p className="text-sm font-medium text-accent mt-1">Incluse</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background-secondary/30 border border-border rounded-lg p-5">
                  <h3 className="font-semibold text-primary mb-3">Informations de livraison</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Livraison dans toute l'Europe
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Suivi de colis en temps réel
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Emballage soigné et sécurisé
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Service client disponible 7j/7
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      {/* Related Products Section */}
      <RelatedProducts products={relatedProducts} />

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
