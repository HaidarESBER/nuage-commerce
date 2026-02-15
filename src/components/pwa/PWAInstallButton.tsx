'use client';

import { useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { IOSInstallInstructions } from './IOSInstallInstructions';

interface PWAInstallButtonProps {
  variant?: 'link' | 'button';
  className?: string;
}

/**
 * Universal PWA Install Button
 *
 * Smart button that handles PWA installation across all platforms:
 * - Chrome/Android: Triggers native install prompt
 * - iOS Safari: Shows step-by-step installation instructions
 * - Already installed: Hides button automatically
 *
 * Can be styled as a link (for footer) or button (for dedicated install page)
 */
export function PWAInstallButton({ variant = 'link', className = '' }: PWAInstallButtonProps) {
  const { isIOS, canInstall, isInstalled, install } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if can't install (no prompt available and not iOS)
  if (!canInstall) {
    return null;
  }

  const handleClick = async () => {
    if (isIOS) {
      // Show iOS instructions modal
      setShowIOSInstructions(true);
    } else {
      // Trigger native install prompt for Chrome/Android
      await install();
    }
  };

  const buttonText = isIOS ? 'Installer l\'application' : 'Installer l\'application';

  if (variant === 'link') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`group inline-block w-fit ${className}`}
        >
          <span className="relative text-background/80 transition-colors duration-200 group-hover:text-background flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            {buttonText}
          </span>
        </button>

        {isIOS && (
          <IOSInstallInstructions
            isOpen={showIOSInstructions}
            onClose={() => setShowIOSInstructions(false)}
          />
        )}
      </>
    );
  }

  // Button variant (for dedicated install pages or prominent CTAs)
  return (
    <>
      <button
        onClick={handleClick}
        className={`px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 transition-colors duration-300 flex items-center gap-2 justify-center ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        {buttonText}
      </button>

      {isIOS && (
        <IOSInstallInstructions
          isOpen={showIOSInstructions}
          onClose={() => setShowIOSInstructions(false)}
        />
      )}
    </>
  );
}
