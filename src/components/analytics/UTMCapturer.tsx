"use client";

import { useEffect } from "react";
import { captureUTMParams } from "@/lib/referral";

/**
 * UTM and Referral Parameter Capturer
 * Captures UTM parameters and referral codes on page load
 * Runs client-side only, invisible component
 */
export function UTMCapturer() {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Capture UTM params and referral code on mount
    captureUTMParams();
  }, []); // Empty deps - run once on mount

  // Invisible component - renders nothing
  return null;
}
