"use client";

import Link from "next/link";

interface StarterKit {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  items: string[];
  badge?: "Editor's Pick" | "New Arrival" | "Best Value";
  featured?: boolean;
}

const starterKits: StarterKit[] = [
  {
    id: "midnight-lounge",
    name: "The Midnight Lounge Set",
    description: "The ultimate home experience. Includes our flagship carbon-fiber stem, handcrafted crystal base, and precision heat management system.",
    price: 45900,
    originalPrice: 52000,
    image: "/images/collections/midnight-lounge.jpg",
    items: ["Carbon Hookah", "HMD Device", "Phunnel Bowl", "LED Base Light"],
    badge: "Editor's Pick",
    featured: true,
  },
  {
    id: "solo-session",
    name: "Solo Session Kit",
    description: "Perfect for the individual connoisseur. Compact, efficient, and elegant.",
    price: 18900,
    image: "/images/collections/solo-session.jpg",
    items: ["Mini Hookah", "Tongs", "1kg Charcoal"],
  },
  {
    id: "travel-ready",
    name: "Travel Ready Pack",
    description: "Everything you need for sessions on the go. Durable case included.",
    price: 22900,
    image: "/images/collections/travel-ready.jpg",
    items: ["Travel Hookah", "Carry Case", "Mini Charcoal", "Cleaning Kit"],
    badge: "New Arrival",
  },
  {
    id: "premium-starter",
    name: "Premium Starter Bundle",
    description: "Begin your journey with professional-grade equipment from day one.",
    price: 32900,
    image: "/images/collections/premium-starter.jpg",
    items: ["Premium Hookah", "3 Bowls", "Charcoal 2kg", "Accessories Pack"],
    badge: "Best Value",
  },
];

export function StarterKitsSection() {
  return (
    <section className="w-full bg-background-dark py-20">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="text-primary tracking-[0.3em] text-sm uppercase font-semibold mb-4 block">
          The Curator's Choice
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight uppercase">
          Coffrets Découverte
        </h2>
        <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
          Elevate your ritual. Our expertly curated starter kits blend engineering excellence with aesthetic perfection.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 w-full mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-dark/70 backdrop-blur-md rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg border border-white/5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-gray-400 text-sm uppercase tracking-wider mr-2 font-medium">
                Filter By:
              </span>
              <button className="group relative px-4 py-2 rounded-lg bg-surface-dark border border-gray-700 hover:border-primary/50 text-sm text-gray-300 hover:text-primary transition-all flex items-center gap-2">
                <span>Level</span>
                <span className="material-icons text-base group-hover:rotate-180 transition-transform">
                  expand_more
                </span>
              </button>
              <button className="group relative px-4 py-2 rounded-lg bg-surface-dark border border-gray-700 hover:border-primary/50 text-sm text-gray-300 hover:text-primary transition-all flex items-center gap-2">
                <span>Price Range</span>
                <span className="material-icons text-base group-hover:rotate-180 transition-transform">
                  expand_more
                </span>
              </button>
              <button className="group relative px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-sm text-primary transition-all flex items-center gap-2">
                <span>Bundle Type</span>
                <span className="material-icons text-base">filter_list</span>
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="hidden sm:inline">Showing {starterKits.length} premium collections</span>
              <div className="h-4 w-px bg-gray-700 hidden sm:block"></div>
              <button className="hover:text-white flex items-center gap-1 transition-colors">
                Sort by: Featured <span className="material-icons text-base">sort</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(400px,auto)]">
          {starterKits.map((kit) =>
            kit.featured ? (
              /* Featured Large Item (2x2) */
              <div
                key={kit.id}
                className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl"
              >
                {kit.badge && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {kit.badge}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-surface-dark to-background-dark"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{kit.name}</h3>
                      <p className="text-gray-300 max-w-md mb-4 font-light">{kit.description}</p>

                      {/* Included Items Badges */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {kit.items.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-gray-200 border border-white/10"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-primary text-3xl font-bold mb-1">
                        €{(kit.price / 100).toFixed(0)}
                      </p>
                      {kit.originalPrice && (
                        <p className="text-gray-500 text-sm line-through decoration-primary/50">
                          €{(kit.originalPrice / 100).toFixed(0)}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/collections/${kit.id}`}
                    className="block w-full bg-white text-background-dark hover:bg-primary hover:text-black font-bold py-4 rounded-lg transition-all duration-300 uppercase tracking-widest text-center group-hover:shadow-[0_0_20px_rgba(18,222,38,0.3)]"
                  >
                    Add to Collection{" "}
                    <span className="material-icons text-sm align-middle">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Standard Item */
              <div
                key={kit.id}
                className="group relative overflow-hidden rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-surface-dark to-background-dark"></div>

                  {kit.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                          kit.badge === "New Arrival"
                            ? "bg-blue-500/80"
                            : kit.badge === "Best Value"
                            ? "bg-green-500/80"
                            : "bg-primary/80"
                        }`}
                      >
                        {kit.badge}
                      </span>
                    </div>
                  )}

                  <button className="absolute top-3 right-3 bg-black/50 hover:bg-primary text-white hover:text-black p-2 rounded-full backdrop-blur-sm transition-colors z-10">
                    <span className="material-icons text-sm">favorite_border</span>
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {kit.name}
                      </h3>
                      <span className="text-primary font-bold">€{(kit.price / 100).toFixed(0)}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{kit.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {kit.items.map((item) => (
                        <span key={item} className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-primary rounded-full"></span> {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/collections/${kit.id}`}
                    className="block w-full py-3 rounded border border-gray-600 text-gray-300 hover:border-primary hover:text-primary transition-all text-sm uppercase tracking-wider font-semibold text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
