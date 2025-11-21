"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Grid, List, ShoppingCart, Filter } from "lucide-react";
import ProductCard from "@/components/product-cart";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast"; // Recommended: better than alert()

// Improved Checkbox using shadcn style
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Types
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  afterDiscount?: number;
  discount?: number;
  images?: string[];
  category?: { _id: string; name: string };
  brand?: { _id: string; name: string };
}

interface Category {
  _id: string;
  name: string;
}
interface Brand {
  _id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [isPending, startTransition] = useTransition(); // Smooth UX

  const API_BASE_URL = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    []
  );

  // Cart persistence
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch filters (categories & brands)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/category`),
          axios.get(`${API_BASE_URL}/brand`),
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };
    fetchFilters();
  }, [API_BASE_URL]);

  // Fetch products with filters (debounced & optimized)
  const fetchProducts = useCallback(async () => {
    startTransition(() => {
      setIsLoading(true);
      setError(null);
    });

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCategory) params.set("categoryId", selectedCategory);
      if (selectedBrands.length > 0)
        params.set("brandId", selectedBrands.join(","));

      const res = await axios.get(`${API_BASE_URL}/product`, { params });
      setProducts(res.data.data || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load products";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedBrands, API_BASE_URL]);

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300); // Debounce search
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  // Add to Cart
  const addToCart = async (productId: string) => {
    try {
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        localStorage.setItem("sessionId", sessionId);
      }

      const product = products.find((p) => p._id === productId);
      if (!product) return toast.error("Product not found");

      await axios.post(`${API_BASE_URL}/cart/add`, {
        sessionId,
        items: [
          {
            productId,
            quantity: 1,
            priceAtAddition: product.afterDiscount || product.price,
          },
        ],
      });

      setCart((prev) => {
        const existing = prev.find((i) => i.id === productId);
        if (existing) {
          return prev.map((i) =>
            i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { id: productId, quantity: 1 }];
      });

      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
            Shop Our Products
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Find exactly what you're looking for
          </p>
        </motion.div>

        {/* Search + Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={cat._id}
                        checked={selectedCategory === cat._id}
                        onCheckedChange={() =>
                          setSelectedCategory(
                            selectedCategory === cat._id ? null : cat._id
                          )
                        }
                      />
                      <Label
                        htmlFor={cat._id}
                        className="cursor-pointer text-sm"
                      >
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="font-medium mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div
                      key={brand._id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={brand._id}
                        checked={selectedBrands.includes(brand._id)}
                        onCheckedChange={(checked) => {
                          setSelectedBrands((prev) =>
                            checked
                              ? [...prev, brand._id]
                              : prev.filter((id) => id !== brand._id)
                          );
                        }}
                      />
                      <Label
                        htmlFor={brand._id}
                        className="cursor-pointer text-sm"
                      >
                        {brand.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isPending || isLoading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <p className="text-red-600">{error}</p>
                <Button onClick={fetchProducts} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-600">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <motion.div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "space-y-6"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        product={{
                          id: product._id,
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          images: product.images?.[0]?.url,
                          category:product.categoryName || product.categoryId?.name,
                        }}
                        variant={viewMode === "list" ? "compact" : "default"}
                        // Instead of just calling addToCart locally, do:
                        onAddToCart={() => addToCart(product._id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
