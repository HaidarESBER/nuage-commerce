"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

const WISHLIST_STORAGE_KEY = "nuage-wishlist";

interface WishlistContextValue {
  wishlistItems: string[]; // Array of product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  isLoading: boolean;
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
 * For authenticated users: syncs with database via API
 * For guest users: uses localStorage only
 */
export function WishlistProvider({ children }: WishlistProviderProps) {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status and load wishlist
  useEffect(() => {
    async function init() {
      try {
        // Check if user is authenticated by trying to fetch wishlist
        const response = await fetch('/api/wishlist');

        if (response.ok) {
          // User is authenticated - load from API
          setIsAuthenticated(true);
          const data = await response.json();
          const productIds = data.items.map((item: any) => item.productId);
          setWishlistItems(productIds);
        } else if (response.status === 401) {
          // User is not authenticated - load from localStorage
          setIsAuthenticated(false);
          const stored = loadWishlistFromStorage();
          setWishlistItems(stored);
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        // Fallback to localStorage on error
        const stored = loadWishlistFromStorage();
        setWishlistItems(stored);
        setIsAuthenticated(false);
      } finally {
        setIsHydrated(true);
      }
    }

    init();
  }, []);

  // Listen for storage events from other tabs (guest users only)
  useEffect(() => {
    if (isAuthenticated === false) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === WISHLIST_STORAGE_KEY) {
          setWishlistItems(loadWishlistFromStorage());
        }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [isAuthenticated]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (isHydrated && isAuthenticated === false) {
      saveWishlistToStorage(wishlistItems);
    }
  }, [wishlistItems, isHydrated, isAuthenticated]);

  const addToWishlist = useCallback(async (productId: string) => {
    // Optimistic update
    setWishlistItems((current) => {
      if (current.includes(productId)) {
        return current;
      }
      return [...current, productId];
    });

    // If authenticated, sync with API
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
          // Revert optimistic update on error
          setWishlistItems((current) => current.filter(id => id !== productId));
          console.error('Failed to add to wishlist');
        }
      } catch (error) {
        // Revert optimistic update on error
        setWishlistItems((current) => current.filter(id => id !== productId));
        console.error('Failed to add to wishlist:', error);
      }
    } else {
      // Guest user - just save to localStorage (handled by useEffect)
    }
  }, [isAuthenticated]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    // Optimistic update
    const previousItems = wishlistItems;
    setWishlistItems((current) => current.filter((id) => id !== productId));

    // If authenticated, sync with API
    if (isAuthenticated) {
      try {
        const response = await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          // Revert optimistic update on error
          setWishlistItems(previousItems);
          console.error('Failed to remove from wishlist');
        }
      } catch (error) {
        // Revert optimistic update on error
        setWishlistItems(previousItems);
        console.error('Failed to remove from wishlist:', error);
      }
    } else {
      // Guest user - just save to localStorage (handled by useEffect)
    }
  }, [isAuthenticated, wishlistItems]);

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
    isLoading,
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
