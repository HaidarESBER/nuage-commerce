"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Loading screen component with video
 *
 * Features:
 * - Shows loading video on initial page load
 * - Fades out once content is ready
 * - Only shows on first load (uses sessionStorage)
 */
export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if we've already shown the loading screen in this session
    const hasShownLoading = sessionStorage.getItem("hasShownLoading");

    if (!hasShownLoading) {
      setShouldShow(true);

      // Minimum display time for the loading screen (2 seconds)
      const minDisplayTime = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasShownLoading", "true");
      }, 2000);

      return () => clearTimeout(minDisplayTime);
    } else {
      // If already shown, don't show it again
      setIsLoading(false);
      setShouldShow(false);
    }
  }, []);

  // If we shouldn't show it at all, return null
  if (!shouldShow && !isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/nuage-loading-video.mp4" type="video/mp4" />
          </video>

          {/* Optional: Loading text overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </div>
              <p className="text-white/80 text-sm tracking-wider">CHARGEMENT...</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
