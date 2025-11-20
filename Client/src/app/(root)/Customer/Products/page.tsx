"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/product-cart";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    []
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/product?search=${searchQuery}`
        );
        setProducts(response.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, API_BASE_URL]);

  // Add to cart handler
  const addToCart = async (productId) => {
    setLoading(true);
    try {
      // Get sessionId from localStorage or generate one
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        localStorage.setItem("sessionId", sessionId);
      }

      // Find the product to get its current price
      const product = products.find((p) => p._id === productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // 1. Send request to backend with correct format including priceAtAddition
      const response = await axios.post("http://localhost:8080/api/cart/add", {
        sessionId, // Use sessionId for guest users
        items: [
          // Backend expects items array
          {
            productId,
            quantity: 1,
            priceAtAddition: product.afterDiscount || product.price, // Required field
          },
        ],
      });

      // 2. Update local cart state
      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.id === productId);
        if (existing) {
          return prevCart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { id: productId, quantity: 1 }];
        }
      });

      console.log("✅ Item added to cart:", response.data);

      // Optional: Show success message
      // You could add a toast notification here
    } catch (error) {
      console.error(
        "❌ Error adding to cart:",
        error.response?.data || error.message
      );

      // Show specific error message from backend
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add item to cart";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // Calculate total cart items
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Explore Our Collection
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover the best products curated just for you
          </p>
        </motion.div>

        {/* Search, View Mode, and Cart */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full sm:w-96"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 rounded-full border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-l-full transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-r-full transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="h-5 w-5" />
            </Button>
            <motion.div
              animate={{ scale: cartItemCount > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Button
                variant="outline"
                className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12"
          >
            <div className="animate-spin h-10 w-10 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-300 rounded-lg p-6 text-center"
          >
            <p className="text-red-600 font-semibold">{error}</p>
            <Button
              onClick={() => setProducts([])} // Trigger refetch by resetting products
              className="mt-4 bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Products Display */}
        <AnimatePresence>
          {!isLoading && !error && products.length > 0 ? (
            <motion.div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {products.map((product: any, index: number) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                >
                  <ProductCard
                    product={{
                      id: product._id,
                      name: product.name,
                      description: product.description,
                      price: product.afterDiscount,
                      images: product.images[0]?.url,
                      category: product.categoryName || product.categoryId,
                    }}
                    variant={viewMode === "list" ? "compact" : "default"}
                    // Instead of just calling addToCart locally, do:
                    onAddToCart={() => addToCart(product._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !isLoading &&
            !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-12 text-center"
              >
                <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or explore our categories.
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
