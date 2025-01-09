"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";

export default function Home() {
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: 1,
      name: "Stylish T-Shirt",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Comfortable Jeans",
      price: 59.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 89.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Leather Wallet",
      price: 39.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      name: "Sunglasses",
      price: 49.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 6,
      name: "Wristwatch",
      price: 129.99,
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Featured Products</h1>
        <ProductList products={products} onAddToCart={addToCart} />
      </main>
      <footer className="bg-blue-600 text-white p-4 mt-8">
        <footer className="container mx-auto text-center">
          <p>&copy; 2023 manishBaba. All rights reserved.</p>
        </footer>
      </footer>
    </main>
  );
}
