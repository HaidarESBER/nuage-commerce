"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const WISHLIST_STORAGE_KEY = "nuage-wishlist";

interface WishlistContextValue {
  wishlistItems: string[]; // Array of product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

/**
 * Load wishlist from localStorage
 */
function loadWishlistFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load wishlist from localStorage:", error);
  }
  return [];
}

/**
 * Save wishlist to localStorage
 */
function saveWishlistToStorage(items: string[]): void {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save wishlist to localStorage:", error);
  }
}

/**
 * WishlistProvider component that wraps the app and provides wishlist state
 * Persists wishlist to localStorage with hydration-safe initialization
 */
export function WishlistProvider({ children }: WishlistProviderProps) {
  // Start with empty array to avoid hydration mismatch
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    const stored = loadWishlistFromStorage();
    setWishlistItems(stored);
    setIsHydrated(true);
  }, []);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY) {
        setWishlistItems(loadWishlistFromStorage());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveWishlistToStorage(wishlistItems);
    }
  }, [wishlistItems, isHydrated]);

  const addToWishlist = useCallback((productId: string) => {
    setWishlistItems((current) => {
      if (current.includes(productId)) {
        return current; // Already in wishlist
      }
      return [...current, productId];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((current) => current.filter((id) => id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.includes(productId);
    },
    [wishlistItems]
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const value: WishlistContextValue = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

/**
 * Hook to access wishlist context
 * Must be used within a WishlistProvider
 */
export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
