'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  isIOS: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  install: () => Promise<void>;
}

export function usePWAInstall(): PWAInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Detect if app is already installed (running in standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone
      || document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event (Chrome/Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      // For iOS or if prompt not available, caller should show instructions
      return;
    }

    // Show the native install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt as it can only be used once
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return {
    isIOS,
    isStandalone,
    canInstall: !!deferredPrompt || (isIOS && !isStandalone),
    isInstalled: isStandalone,
    install,
  };
}
