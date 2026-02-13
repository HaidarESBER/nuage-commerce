"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductHeader } from "@/components/product/ProductInfoSection/ProductHeader";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ExpandableSection } from "@/components/product/ProductContent/ExpandableSection";
import { MobileStickyBar } from "@/components/product/StickyBuyBar/MobileStickyBar";
import { Product, categoryLabels } from "@/types/product";
import { Review, ProductRatingStats } from "@/data/reviews";
import { addToRecentlyViewed } from "@/lib/social-proof";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

// Lazy load below-fold content for better initial page load
const RelatedProductsSection = lazy(() =>
  import("@/components/product/RelatedProductsSection").then((mod) => ({
    default: mod.RelatedProductsSection,
  }))
);

interface ProductDetailClientProps {
  product: Product;
  allProducts: Product[];
  reviews: Review[];
  stats: ProductRatingStats | null;
}

export function ProductDetailClient({ product, allProducts, reviews, stats }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const hasDiscount = Boolean(
    product.compareAtPrice && product.compareAtPrice > product.price
  );
  const discountPercentage = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Track product view
  useEffect(() => {
    addToRecentlyViewed(product);
  }, [product]);

  // Keyboard navigation and zoom handling
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
    document.body.style.overflow = isZoomOpen ? "hidden" : "";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isZoomOpen, product.images.length]);

  // Handlers for sticky bar
  const handleAddToCart = () => {
    if (product.inStock) {
      addItem(product, 1);
    }
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id, product.name);
    } else {
      addToWishlist(product.id, product.name);
    }
  };

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
    <main className="min-h-screen bg-gradient-to-b from-background to-background-secondary/30">
      {/* Breadcrumb Section */}
      <div className="bg-background border-b border-border/50">
        <Container size="xl">
          <nav className="py-4">
            <ol className="flex items-center gap-2 text-sm text-muted">
              <li>
                <Link href="/produits" className="hover:text-primary transition-colors font-medium">
                  Produits
                </Link>
              </li>
              <li><ChevronRight className="w-3.5 h-3.5" /></li>
              <li>
                <Link
                  href={`/produits?categorie=${product.category}`}
                  className="hover:text-primary transition-colors font-medium"
                >
                  {categoryLabels[product.category]}
                </Link>
              </li>
              <li><ChevronRight className="w-3.5 h-3.5" /></li>
              <li className="text-primary font-medium truncate line-clamp-1">{product.name}</li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Hero Section - Image + Product Info */}
      <section className="bg-background py-8 lg:py-10">
        <Container size="xl">
          {/* Mobile: Stacked Layout */}
          <div className="lg:hidden space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                category={product.category}
                hasDiscount={hasDiscount}
                discountPercentage={discountPercentage}
                selectedIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                onImageClick={openZoom}
              />
            </motion.div>

            <div className="space-y-6">
              <ProductHeader
                name={product.name}
                category={product.category}
                stats={stats}
              />
              <div className="border-b border-border/30 pb-6">
                <p className="font-heading text-base text-primary/90 leading-relaxed font-light tracking-wide">
                  {product.shortDescription}
                </p>
              </div>
              <BuyBox product={product} />
            </div>
          </div>

          {/* Desktop: Image LEFT, Info RIGHT - Equal Width */}
          <div className="hidden lg:flex gap-8 items-start justify-center">
            {/* Image Gallery - Larger, Highlighted */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-[550px] flex-shrink-0"
            >
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                category={product.category}
                hasDiscount={hasDiscount}
                discountPercentage={discountPercentage}
                selectedIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                onImageClick={openZoom}
              />
            </motion.div>

            {/* Product Info - To the RIGHT of image, Same Width, Height Constrained */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-[550px] flex-shrink-0 space-y-4 flex flex-col"
              style={{ maxHeight: '550px' }}
            >
              {/* Product Header */}
              <div className="flex-shrink-0">
                <ProductHeader
                  name={product.name}
                  category={product.category}
                  stats={stats}
                />
              </div>

              {/* Short Description */}
              <div className="border-b border-border/30 pb-4 flex-shrink-0">
                <p className="font-heading text-base lg:text-lg text-primary/90 leading-relaxed font-light tracking-wide">
                  {product.shortDescription}
                </p>
              </div>

              {/* Buy Box - Scrollable if needed */}
              <div className="flex-1 min-h-0">
                <BuyBox product={product} />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Product Details Section */}
      <section className="py-8 lg:py-12 bg-background-secondary/20">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Full Description */}
            <div className="bg-background border border-border/30 rounded-xl p-6 lg:p-8 shadow-sm">
              <h2 className="font-heading text-xl lg:text-2xl text-primary mb-4 font-light tracking-wide">
                Description complète
              </h2>
              <p className="text-text text-sm lg:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Specifications if available */}
            {product.specs && product.specs.length > 0 && (
              <div className="bg-background border border-border/30 rounded-xl p-6 lg:p-8 shadow-sm">
                <h2 className="font-heading text-xl lg:text-2xl text-primary mb-4 font-light tracking-wide">
                  Caractéristiques techniques
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <span className="text-xs text-muted uppercase tracking-wider">
                        {spec.label}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Additional Content Section - Reviews & Shipping */}
      <section className="py-12 lg:py-16 bg-background-secondary/20">
        <Container size="xl">

          {/* Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Reviews Card */}
            <div className="bg-background border border-border/30 rounded-xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-xl lg:text-2xl text-primary font-light tracking-wide">
                  Avis clients
                </h2>
                {stats && stats.totalReviews > 0 && (
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                    {stats.totalReviews} avis
                  </span>
                )}
              </div>
              <ProductReviews reviews={reviews} stats={stats} />
            </div>

            {/* Shipping & Returns Card */}
            <div className="bg-background border border-border/30 rounded-xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow">
              <h2 className="font-heading text-xl lg:text-2xl text-primary mb-5 font-light tracking-wide">
                Livraison & Retours
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex gap-4 p-4 bg-background-secondary/30 rounded-xl hover:bg-background-secondary/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
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

                  <div className="flex gap-4 p-4 bg-background-secondary/30 rounded-xl hover:bg-background-secondary/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
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

                  <div className="flex gap-4 p-4 bg-background-secondary/30 rounded-xl hover:bg-background-secondary/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
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

                  <div className="flex gap-4 p-4 bg-background-secondary/30 rounded-xl hover:bg-background-secondary/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
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
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Related Products Section - Lazy loaded */}
      <Suspense
        fallback={
          <section className="mt-16 sm:mt-24 bg-background-secondary py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-10 bg-muted/20 rounded w-64 mx-auto mb-3 animate-pulse" />
                <div className="h-6 bg-muted/20 rounded w-96 mx-auto animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-background-card rounded-xl overflow-hidden border border-border/50 animate-pulse"
                  >
                    <div className="aspect-square bg-muted/20" />
                    <div className="p-5">
                      <div className="h-6 bg-muted/20 rounded mb-3" />
                      <div className="h-4 bg-muted/20 rounded w-3/4 mb-4" />
                      <div className="h-10 bg-muted/20 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      >
        <RelatedProductsSection
          productId={product.id}
          category={product.category}
          allProducts={allProducts}
          limit={6}
        />
      </Suspense>

      {/* Mobile Sticky Buy Bar */}
      <MobileStickyBar
        product={product}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isInWishlist={isInWishlist(product.id)}
      />

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
