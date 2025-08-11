'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from"../../../../lib/type"
import { addToCart, updateCartItem, removeFromCart, fetchCart } from '../lib/api';

interface CartContextType {
  cart: CartItem[];
  addItem: (productId: string, name: string, price: number, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const refreshCart = async () => {
    const cartData = await fetchCart();
    setCart(cartData);
  };

  const addItem = async (productId: string, name: string, price: number, quantity: number) => {
    await addToCart(productId, quantity);
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, name, price, quantity }];
    });
  };

  const updateItem = async (productId: string, quantity: number) => {
    await updateCartItem(productId, quantity);
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeItem = async (productId: string) => {
    await removeFromCart(productId);
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}