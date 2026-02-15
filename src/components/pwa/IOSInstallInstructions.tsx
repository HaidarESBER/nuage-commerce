'use client';

import { useEffect } from 'react';
import { BottomSheet } from '../mobile/BottomSheet';

interface IOSInstallInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SESSION_STORAGE_KEY = 'ios-install-instructions-shown';

/**
 * iOS PWA Installation Instructions Modal
 *
 * Displays step-by-step instructions for installing the PWA on iOS Safari.
 * Uses sessionStorage to show only once per session.
 */
export function IOSInstallInstructions({ isOpen, onClose }: IOSInstallInstructionsProps) {
  // Mark as shown in session storage when opened
  useEffect(() => {
    if (isOpen) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Installer l'application"
    >
      <div className="space-y-6 text-primary">
        {/* Introduction */}
        <p className="text-base text-muted">
          Pour installer cette application sur votre iPhone ou iPad, suivez ces étapes simples :
        </p>

        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center font-semibold text-sm">
            1
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">Appuyez sur le bouton Partager</h3>
            <p className="text-sm text-muted mb-3">
              Cherchez l&apos;icône de partage (un carré avec une flèche vers le haut) en bas de Safari.
            </p>
            <div className="bg-background-secondary rounded-lg p-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center font-semibold text-sm">
            2
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">Faites défiler et appuyez sur &quot;Sur l&apos;écran d&apos;accueil&quot;</h3>
            <p className="text-sm text-muted mb-3">
              Dans le menu de partage, faites défiler vers le bas et recherchez l&apos;option &quot;Sur l&apos;écran d&apos;accueil&quot;.
            </p>
            <div className="bg-background-secondary rounded-lg p-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center font-semibold text-sm">
            3
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">Appuyez sur &quot;Ajouter&quot;</h3>
            <p className="text-sm text-muted mb-3">
              Confirmez en appuyant sur le bouton &quot;Ajouter&quot; en haut à droite de l&apos;écran.
            </p>
            <div className="bg-background-secondary rounded-lg p-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Success message */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-primary">
            <strong>C&apos;est tout !</strong> L&apos;application apparaîtra sur votre écran d&apos;accueil et pourra être lancée comme une application native.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}

/**
 * Check if iOS install instructions have been shown this session
 */
export function hasShownIOSInstructions(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
}
