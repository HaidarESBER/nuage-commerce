"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface DesktopGalleryProps {
  images: string[];
  productName: string;
  selectedIndex: number;
  onImageSelect: (index: number) => void;
  onImageClick: () => void;
  hasDiscount?: boolean;
  discountPercentage?: number;
}

/**
 * Desktop-optimized gallery with thumbnail navigation
 * Displays main image with thumbnails below
 * Memoized to prevent unnecessary re-renders
 */
export const DesktopGallery = memo(function DesktopGallery({
  images,
  productName,
  selectedIndex,
  onImageSelect,
  onImageClick,
  hasDiscount,
  discountPercentage,
}: DesktopGalleryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-8 md:mb-10 max-w-6xl mx-auto"
    >
      {/* Sale badge */}
      {hasDiscount && discountPercentage && (
        <div className="absolute top-4 right-4 bg-error text-white text-sm font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
          -{discountPercentage}%
        </div>
      )}

      {/* Main Product Image - High Quality Display */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#F7F5F3] to-[#E8E4DF] cursor-pointer group shadow-xl p-6 md:p-8 lg:p-6">
        <div className="relative w-full aspect-square lg:aspect-[16/9]">
          <Image
            src={images[selectedIndex]}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-contain hover:scale-105 transition-transform duration-500"
            priority
            quality={100}
            onClick={onImageClick}
          />
        </div>
      </div>

      {/* Thumbnail Navigation - Below Image */}
      {images.length > 1 && (
        <div className="flex justify-center gap-3 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`
                relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden
                border-2 transition-all duration-300
                ${
                  index === selectedIndex
                    ? "border-[#D4A5A5] shadow-lg scale-105"
                    : "border-border hover:border-muted opacity-70 hover:opacity-100"
                }
              `}
            >
              <Image
                src={image}
                alt={`${productName} - ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
});
