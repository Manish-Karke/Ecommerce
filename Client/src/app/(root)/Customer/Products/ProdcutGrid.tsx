// components/ProductGrid.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import ProductGridEmpty from "./components/ProductGridEmpty";
import ProductGridError from "./components/ProductGridError";
import ProductGridLoading from "./components/ProductGridLoading";
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

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isPending: boolean;
  error: string | null;
  viewMode: "grid" | "list";
  onAddToCart: (productId: string) => void;
  onRetry: () => void;
}

export default function ProductGrid({
  products,
  isLoading,
  isPending,
  error,
  viewMode,
  onAddToCart,
  onRetry,
}: ProductGridProps) {
  const gridClass =
    viewMode === "grid"
      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "space-y-6";

  // Loading state
  if (isPending || isLoading) {
    return <ProductGridLoading viewMode={viewMode} />;
  }

  // Error state
  if (error) {
    return <ProductGridError error={error} onRetry={onRetry} />;
  }

  // Empty state
  if (products.length === 0) {
    return <ProductGridEmpty />;
  }

  // Products list
  return (
    <motion.div
      className={gridClass}
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
                price: product.price / 100,
                images: product.images?.[0]?.url,
                category: product.categoryId.name,
                brand: product.brandId.name,
              }}
              variant={viewMode === "list" ? "compact" : "default"}
              onAddToCart={() => onAddToCart(product._id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}