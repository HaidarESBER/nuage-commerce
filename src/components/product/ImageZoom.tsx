"use client";

import { useState, useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageZoomProps {
  src: string;
  alt: string;
  zoomLevel?: number;
}

/**
 * ImageZoom component with magnifying glass effect
 *
 * Desktop: Hover shows magnified view in separate container
 * Mobile: Tap toggles zoom, pinch-to-zoom support
 */
export function ImageZoom({ src, alt, zoomLevel = 2.5 }: ImageZoomProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobileZoomed, setIsMobileZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; distance: number } | null>(null);

  // Desktop hover handler
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setMousePosition({ x: xPercent, y: yPercent });
    setLensPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Mobile touch handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      // Single touch - track for double tap
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, distance: 0 };
    } else if (e.touches.length === 2) {
      // Pinch gesture - calculate initial distance
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      touchStartRef.current = { x: 0, y: 0, distance };
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isMobileZoomed) {
      e.preventDefault();

      if (e.touches.length === 1) {
        // Pan when zoomed
        const touch = e.touches[0];
        if (touchStartRef.current) {
          const deltaX = touch.clientX - touchStartRef.current.x;
          const deltaY = touch.clientY - touchStartRef.current.y;
          setPanOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
          touchStartRef.current = { x: touch.clientX, y: touch.clientY, distance: 0 };
        }
      } else if (e.touches.length === 2 && touchStartRef.current) {
        // Pinch to zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (touchStartRef.current.distance > 0) {
          const scaleChange = distance / touchStartRef.current.distance;
          setScale((prev) => Math.min(Math.max(prev * scaleChange, 1), 4));
        }

        touchStartRef.current.distance = distance;
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const handleDoubleTap = () => {
    if (isMobileZoomed) {
      // Close zoom
      setIsMobileZoomed(false);
      setScale(1);
      setPanOffset({ x: 0, y: 0 });
      document.body.style.overflow = "";
    } else {
      // Open zoom
      setIsMobileZoomed(true);
      setScale(2);
      document.body.style.overflow = "hidden";
    }
  };

  const closeMobileZoom = () => {
    setIsMobileZoomed(false);
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
    document.body.style.overflow = "";
  };

  return (
    <>
      {/* Desktop: Hover zoom with two-pane layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        {/* Original image */}
        <div
          ref={imageRef}
          className="relative aspect-square bg-background-secondary rounded-[--radius-card] overflow-hidden cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />

          {/* Crosshair lens indicator */}
          {isHovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-32 h-32 border-2 border-accent rounded-full pointer-events-none"
              style={{
                left: lensPosition.x - 64,
                top: lensPosition.y - 64,
                backgroundColor: "rgba(212, 165, 165, 0.1)",
              }}
            />
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm text-primary text-xs px-2 py-1 rounded pointer-events-none">
            Survolez pour zoomer
          </div>
        </div>

        {/* Zoomed view */}
        <div className="relative aspect-square bg-background-secondary rounded-[--radius-card] overflow-hidden border border-background-secondary">
          <AnimatePresence>
            {isHovering ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: `${zoomLevel * 100}%`,
                    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center text-muted text-sm"
              >
                Survolez l&apos;image pour voir le détail
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: Tap to zoom with fullscreen modal */}
      <div className="md:hidden">
        <div
          className="relative aspect-square bg-background-secondary rounded-[--radius-card] overflow-hidden"
          onDoubleClick={handleDoubleTap}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />

          {/* Tap indicator */}
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm text-primary text-xs px-2 py-1 rounded pointer-events-none flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0v6m0-6h6m-6 0H4" />
            </svg>
            Touchez 2x pour zoomer
          </div>
        </div>

        {/* Mobile zoom modal */}
        <AnimatePresence>
          {isMobileZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-primary"
            >
              {/* Close button */}
              <button
                onClick={closeMobileZoom}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-background/90 backdrop-blur-sm text-primary rounded-full"
                aria-label="Fermer le zoom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Zoom indicator */}
              <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm text-primary text-xs px-2 py-1 rounded">
                {scale.toFixed(1)}x
              </div>

              {/* Zoomable image */}
              <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <motion.div
                  animate={{
                    scale,
                    x: panOffset.x,
                    y: panOffset.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-0 right-0 text-center text-background text-sm">
                Pincez pour zoomer • Glissez pour déplacer
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
