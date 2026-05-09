"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/lib/types/firestore";
import { useAuth } from "./auth-provider";
import { syncUserCart, fetchUserCart } from "@/lib/actions/cart";

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number, bundleOptions?: string[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  replaceItems: (items: CartItem[]) => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load
  useEffect(() => {
    async function loadCart() {
      // If user logs in, fetch their cart from Firestore
      if (user) {
        const res = await fetchUserCart(user.uid);
        if (res.success && res.items && res.items.length > 0) {
          // Merge local items with fetched items, or just use fetched
          setItems(res.items);
        } else {
           // Fallback to local storage if no firestore cart
           const savedCart = localStorage.getItem("eqilo-cart");
           if (savedCart) {
             try { setItems(JSON.parse(savedCart)); } catch (e) {}
           }
        }
      } else {
        const savedCart = localStorage.getItem("eqilo-cart");
        if (savedCart) {
          try { setItems(JSON.parse(savedCart)); } catch (e) {}
        }
      }
      setIsLoaded(true);
    }
    loadCart();
  }, [user]);

  // Sync to localStorage and Firestore
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("eqilo-cart", JSON.stringify(items));
      // Debounce or sync directly if user is logged in
      if (user) {
        syncUserCart(user.uid, items).catch(e => console.error("Sync failed", e));
      }
    }
  }, [items, isLoaded, user]);

  const addItem = (productId: string, quantity = 1, bundleOptions?: string[]) => {
    setItems((prev) => {
      const existing = prev.find((item) => 
        item.product_id === productId && 
        JSON.stringify(item.selected_bundle_options || []) === JSON.stringify(bundleOptions || [])
      );
      if (existing) {
        return prev.map((item) =>
          item.product_id === productId && 
          JSON.stringify(item.selected_bundle_options || []) === JSON.stringify(bundleOptions || [])
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product_id: productId, quantity, selected_bundle_options: bundleOptions }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const replaceItems = (newItems: CartItem[]) => setItems(newItems);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, replaceItems, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
