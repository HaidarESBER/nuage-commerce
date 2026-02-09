"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";

const CART_STORAGE_KEY = "nuage-cart";

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Load cart from localStorage
 */
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
  }
  return [];
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

/**
 * CartProvider component that wraps the app and provides cart state
 * Persists cart to localStorage and handles hydration using useSyncExternalStore
 */
export function CartProvider({ children }: CartProviderProps) {
  // Use useSyncExternalStore for proper hydration-safe localStorage sync
  const storedItems = useSyncExternalStore(
    // Subscribe function (storage event listener)
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    // Get snapshot (client)
    loadCartFromStorage,
    // Get server snapshot
    () => []
  );

  // Internal state for managing items
  const [items, setItems] = useState<CartItem[]>(storedItems);

  // Sync from storage on mount and storage events
  useEffect(() => {
    setItems(storedItems);
  }, [storedItems]);

  // Save to localStorage whenever items change (via user actions, not hydration)
  const updateItems = useCallback((newItems: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setItems((prev) => {
      const updated = typeof newItems === "function" ? newItems(prev) : newItems;
      saveCartToStorage(updated);
      return updated;
    });
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    updateItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      return [...currentItems, { product, quantity }];
    });
  }, [updateItems]);

  const removeItem = useCallback((productId: string) => {
    updateItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  }, [updateItems]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      updateItems((currentItems) =>
        currentItems.filter((item) => item.product.id !== productId)
      );
      return;
    }

    updateItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [updateItems]);

  const clearCart = useCallback(() => {
    updateItems([]);
  }, [updateItems]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart context
 * Must be used within a CartProvider
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
