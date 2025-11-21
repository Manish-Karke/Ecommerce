// "use client";

// import React, { createContext, useContext, useState, ReactNode } from "react";
// import { CartItem } from "../../../../lib/type";
// import {
//   addToCart,
//   updateCartItem,
//   removeFromCart,
//   fetchCart,
//   clearCartApi,
// } from "../../../../lib/api";

// interface CartContextType {
//   cart: CartItem[];
//   addItem: (
//     productId: string,
//     name: string,
//     price: number,
//     quantity: number
//   ) => Promise<void>;
//   updateItem: (productId: string, quantity: number) => Promise<void>;
//   removeItem: (productId: string) => Promise<void>;
//   refreshCart: () => Promise<void>;
//   clearCart: () => Promise<void>;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   // 1. Fetch
//   const refreshCart = async () => {
//     const cartData = await fetchCart();
//     setCart(cartData);
//   };

//   // 2. Add
//   const addItem = async (
//     productId: string,
//     name: string,
//     price: number,
//     quantity: number
//   ) => {
//     await addToCart(productId, quantity);
//     setCart((prev) => {
//       const existing = prev.find((item) => item.productId === productId);
//       if (existing) {
//         return prev.map((item) =>
//           item.productId === productId
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }
//       return [...prev, { productId, name, price, quantity }];
//     });
//   };

//   // 3. Update
//   const updateItem = async (productId: string, quantity: number) => {
//     await updateCartItem(productId, quantity);
//     setCart((prev) =>
//       prev.map((item) =>
//         item.productId === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   // 4. Remove
//   const removeItem = async (productId: string) => {
//     await removeFromCart(productId);
//     setCart((prev) => prev.filter((item) => item.productId !== productId));
//   };

//   // 5. Clear Cart
//   const clearCart = async () => {
//     await clearCartApi();
//     setCart([]);
//   };

//   return (
//     <CartContext.Provider
//       value={{ cart, addItem, updateItem, removeItem, refreshCart, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within a CartProvider");
//   return context;
// }
"use client";
import { useState } from "react";
import axios from "axios";

export default function ProductCard({ product  }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/cart", {
        productId: product._id, // assuming MongoDB id
        quantity: 1,
      });

      setMessage("✅ Added to cart!");
      console.log("Cart updated:", res.data);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setMessage("❌ Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-3 rounded-md">
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded-md"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
