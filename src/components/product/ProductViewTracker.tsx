"use client";

import { useEffect } from "react";

interface ProductViewTrackerProps {
  productId: string;
}

/**
 * Fire-and-forget product view tracker
 * Tracks product views for browse history and recommendations
 * Completely silent - no UI, no error propagation
 */
export function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  useEffect(() => {
    // Track view on component mount
    // Fire-and-forget: don't wait for response, ignore errors
    fetch("/api/track/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
      // Use keepalive to ensure request completes even if page navigates
      keepalive: true,
    }).catch(() => {
      // Silent failure - tracking should never break UX
      // No error logging to avoid console spam
    });
  }, [productId]);

  // No UI
  return null;
}
