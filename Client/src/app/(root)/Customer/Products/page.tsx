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
import { Search, Grid, List, ShoppingCart } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { addItem } from "@/redux/slices/counter/cart";

// Import the new separated components
import ProductFilters from "./ProducrFilters";
import ProductGrid from "./ProdcutGrid";
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  afterDiscount?: number;
  discount?: number;
  images: { url: string; alt?: string }[];
  categoryId: { _id: string; name: string };
  brandId: { _id: string; name: string };
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
  const [isPending, startTransition] = useTransition();

  // Redux hooks
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const API_BASE_URL = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    []
  );

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
  const handleAddToCart = async (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return toast.error("Product not found");

    try {
      // Backend sync
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 9)}`;
        localStorage.setItem("sessionId", sessionId);
      }

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

     
      dispatch(
        addItem({
          id: product._id,
          name: product.name,
          price: product.afterDiscount || product.price,
          image: product.images?.[0] || "/placeholder.jpg",
          quantity: 1,
        })
      );

      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // Calculate total cart items from Redux state
  const cartCount = cartItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

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
            {/* <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center">
                  {cartCount}
                </Badge>
              )}
            </Button> */}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Now a separate component */}
          <ProductFilters
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            selectedBrands={selectedBrands}
            onCategoryChange={setSelectedCategory}
            onBrandsChange={setSelectedBrands}
          />

          {/* Product Grid - Now a separate component */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isPending={isPending}
              error={error}
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
              onRetry={fetchProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}