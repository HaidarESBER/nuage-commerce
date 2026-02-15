"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";
import { StarterKitsSection } from "@/components/collections/StarterKitsSection";
import { Product, ProductCategory, categoryLabels } from "@/types/product";

interface HomeClientProps {
  featuredProducts: Product[];
  ratingsMap?: Record<string, { averageRating: number; totalReviews: number }>;
}

export function HomeClient({ featuredProducts, ratingsMap = {} }: HomeClientProps) {
  const router = useRouter();

  const handleRefresh = async () => {
    router.refresh();
  };

  // Group products by category for carousel sections - prioritize featured, show 5 per category
  const productsByCategory = useMemo(() => {
    const categories: ProductCategory[] = ["chicha", "bol", "tuyau", "charbon", "accessoire"];
    const grouped: Record<ProductCategory, Product[]> = {
      chicha: [],
      bol: [],
      tuyau: [],
      charbon: [],
      accessoire: [],
    };

    // Filter out products with placeholder images
    const productsWithRealImages = featuredProducts.filter((product) => {
      if (!product.images || product.images.length === 0) return false;

      // Check if any image is a real photo (not placeholder)
      return product.images.some(img =>
        img &&
        img.trim() !== '' &&
        !img.toLowerCase().includes('placeholder') &&
        !img.toLowerCase().includes('via.placeholder') &&
        !img.toLowerCase().includes('placehold.co')
      );
    });

    // Group products by category
    productsWithRealImages.forEach((product) => {
      if (product.category && grouped[product.category]) {
        grouped[product.category].push(product);
      }
    });

    // Sort each category to show featured products first, then take first 5
    categories.forEach((category) => {
      grouped[category] = grouped[category]
        .sort((a, b) => {
          // Featured products first
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        })
        .slice(0, 5);
    });

    return grouped;
  }, [featuredProducts]);

  const categoryDisplayNames: Record<ProductCategory, string> = {
    chicha: "Nos Chichas du Moment",
    bol: "Nos Bols du Moment",
    tuyau: "Nos Tuyaux du Moment",
    charbon: "Nos Charbons du Moment",
    accessoire: "Nos Accessoires du Moment",
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="relative w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] w-full overflow-hidden flex items-center justify-center pt-4 sm:pt-8 md:pt-12">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
              <source src="/nuage.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-background-dark/20 via-background-dark/80 to-background-dark"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] sm:text-xs font-semibold tracking-wider mb-3 sm:mb-4 uppercase backdrop-blur-md">
              Nouvelle Collection P/E 24
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight tracking-tight">
              Redéfinir le{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                Rituel.
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto font-light leading-relaxed">
              Chichas et accessoires premium sélectionnés pour les connaisseurs modernes. Vivez le luxe à chaque bouffée.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {/* Mobile: Only show "Découvrir la Collection" in secondary style */}
              <Link
                href="/produits"
                className="md:hidden whitespace-nowrap px-6 py-2.5 bg-white/5 border border-white/10 hover:border-primary/50 text-white rounded-full text-sm backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Découvrir la Collection
              </Link>

              {/* Desktop: Show primary CTA */}
              <Link
                href="/produits"
                className="hidden md:inline-flex px-8 py-3 bg-primary text-background-dark font-bold rounded-full hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(18,222,38,0.3)] text-base"
              >
                Voir la Collection
              </Link>

              {/* Desktop: Show category buttons */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/produits?categorie=chicha"
                  className="whitespace-nowrap px-5 py-2.5 bg-white/5 border border-white/10 hover:border-primary/50 text-white rounded-full text-sm backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Chichas
                </Link>
                <Link
                  href="/produits?categorie=accessoire"
                  className="whitespace-nowrap px-5 py-2.5 bg-white/5 border border-white/10 hover:border-primary/50 text-white rounded-full text-sm backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Accessoires
                </Link>
                <Link
                  href="/produits?categorie=charbon"
                  className="whitespace-nowrap px-5 py-2.5 bg-white/5 border border-white/10 hover:border-primary/50 text-white rounded-full text-sm backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Charbon
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Categories */}
        <section className="hidden md:block py-8 md:py-10 px-4 md:px-6 max-w-[1600px] w-full mx-auto">
          <div className="flex items-end justify-between mb-4 md:mb-5">
            <h2 className="text-xl md:text-2xl font-bold">Découvrir les Catégories</h2>
            <Link
              href="/produits"
              className="text-primary hover:text-white transition-colors text-xs md:text-sm flex items-center gap-1 group"
            >
              Voir Tout{" "}
              <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-auto md:h-[480px]">
            {/* Large Item: Chichas */}
            <Link
              href="/produits?categorie=chicha"
              className="col-span-1 md:col-span-2 md:row-span-2 relative group rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src="/chicha.jpg"
                alt="Chichas"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                <span className="text-primary text-xs font-semibold mb-1">Phare</span>
                <h3 className="text-2xl font-bold text-white mb-1">Chichas</h3>
                <p className="text-gray-300 text-xs max-w-xs opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Découvrez notre sélection de chichas de classe mondiale.
                </p>
              </div>
            </Link>

            {/* Medium Item: Bowls */}
            <Link
              href="/produits?categorie=bol"
              className="col-span-1 md:col-span-2 md:row-span-1 relative group rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src="/bowl.jpg"
                alt="Bols"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
                <h3 className="text-xl font-bold text-white">Bols (Bowls)</h3>
                <p className="text-gray-300 text-xs mt-0.5">Céramiques artisanales pour une chaleur optimale.</p>
              </div>
            </Link>

            {/* Small Item: Coals */}
            <Link
              href="/produits?categorie=charbon"
              className="col-span-1 md:col-span-1 md:row-span-1 relative group rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src="/coal.webp"
                alt="Charbon"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
                <h3 className="text-lg font-bold text-white">Charbon</h3>
              </div>
            </Link>

            {/* Small Item: Hoses */}
            <Link
              href="/produits?categorie=tuyau"
              className="col-span-1 md:col-span-1 md:row-span-1 relative group rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src="/hose.webp"
                alt="Tuyaux"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
                <h3 className="text-lg font-bold text-white">Tuyaux</h3>
                <p className="text-[10px] text-primary mt-0.5">Accessoires</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Category Carousels - Mobile Scrollable */}
        <section className="py-8 sm:py-10 bg-black/20 relative w-full overflow-hidden">
          {/* Background decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-[1600px] w-full mx-auto relative z-10 space-y-8 sm:space-y-10 md:space-y-12">
            {(["chicha", "bol", "tuyau", "charbon", "accessoire"] as ProductCategory[]).map((category) => {
              const categoryProducts = productsByCategory[category];

              // Only show category if it has products
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category}>
                  {/* Category Header */}
                  <div className="px-4 md:px-6 mb-4 sm:mb-5 md:mb-6">
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-primary text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                          Sélection
                        </span>
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1">
                          {categoryDisplayNames[category]}
                        </h2>
                      </div>

                      {/* Mobile: Button style */}
                      <Link
                        href={`/produits?categorie=${category}`}
                        className="md:hidden px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-full text-xs font-medium hover:bg-primary/30 transition-all whitespace-nowrap"
                      >
                        Voir plus
                      </Link>

                      {/* Desktop: Text link */}
                      <Link
                        href={`/produits?categorie=${category}`}
                        className="hidden md:flex text-primary hover:text-white transition-colors text-sm items-center gap-1 group whitespace-nowrap"
                      >
                        Voir tout
                        <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Product List */}
                  <div className="overflow-x-auto hide-scrollbar px-4 md:px-6">
                    <div className="flex gap-3 sm:gap-4 pb-2">
                      {categoryProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px]"
                        >
                          <ProductCard
                            product={product}
                            priority={false}
                            ratingStats={ratingsMap[product.id] || null}
                            disableAnimation={true}
                          />
                        </div>
                      ))}

                      {/* Voir Tout Card */}
                      <Link
                        href={`/produits?categorie=${category}`}
                        className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px] aspect-[3/4] rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 bg-background-card/30 backdrop-blur-sm flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all hover:bg-background-card/50 group"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="material-icons text-2xl sm:text-3xl text-primary">arrow_forward</span>
                        </div>
                        <div className="text-center px-4 sm:px-6">
                          <p className="text-white font-semibold text-sm sm:text-base md:text-lg mb-1">
                            Voir tous les
                          </p>
                          <p className="text-primary font-bold text-base sm:text-lg md:text-xl">
                            {categoryLabels[category]}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Curated Collection Starter Kits - Hidden for now */}
        {/* <StarterKitsSection /> */}

        {/* Experience / Brand Section */}
        <section className="py-8 sm:py-10 md:py-12 px-4 md:px-6 relative overflow-hidden w-full">
          <div className="absolute inset-0 z-0 bg-background-dark"></div>

          <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center relative z-10">
            <div className="order-2 md:order-1">
              <div className="bg-white/5 p-5 sm:p-6 rounded-lg backdrop-blur-md border border-white/5">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Sublimez Votre Session</h2>
                <p className="text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                  Nuage n'est pas seulement une boutique ; c'est une destination pour les passionnés. Nous sélectionnons uniquement les
                  meilleurs matériaux—aluminium aérospatial, cristal bohème et silicone médical—pour garantir que chaque session soit pure, puissante et parfaite.
                </p>
                <ul className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-6">
                  <li className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-icons text-xs">check</span>
                    </div>
                    <span className="text-white text-xs sm:text-sm">Expédition garantie sous 24h</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-icons text-xs">verified</span>
                    </div>
                    <span className="text-white text-xs sm:text-sm">Marques Premium Authentiques</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-icons text-xs">support_agent</span>
                    </div>
                    <span className="text-white text-xs sm:text-sm">Support Expert Connaisseur</span>
                  </li>
                </ul>

                {/* Founders Quote */}
                <div className="my-4 sm:my-6 pl-4 border-l-2 border-primary/30">
                  <p className="text-gray-300 text-xs sm:text-sm italic leading-relaxed mb-2">
                    "Nous avons réalisé que la chicha en Europe était souvent perçue comme une simple distraction, dépouillée de toute sa dimension culturelle et spirituelle. Les produits étaient de qualité médiocre, l'expérience précipitée, la passion absente."
                  </p>
                  <p className="text-primary text-xs font-semibold">
                    — Ali & Haidar, Fondateurs de Nuage
                  </p>
                </div>

                <Link
                  href="/about"
                  className="text-primary font-bold hover:text-white transition-colors flex items-center gap-2 group text-sm sm:text-base"
                >
                  Lire Notre Histoire{" "}
                  <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-square">
                <img
                  src="/history.jpeg"
                  alt="Notre histoire - Deux frères libanais passionnés par la chicha"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </PullToRefresh>
  );
}
