// components/product-card.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    afterDiscount?: number;
    images: { url: string }[];
    categoryId: { name: string };
    brandId: { name: string };
  };
  variant: "default" | "compact";
  onAddToCart: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant,
  onAddToCart,
}) => {
  const displayPrice = product.afterDiscount || product.price;

  return (
    <Link href={`Products/${product._id}`} className="block">
      <motion.div
        className={`group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${
          variant === "compact" ? "flex" : "block"
        }`}
        whileHover={{ y: -8 }}
      >
        <div className="relative aspect-square bg-gray-100">
          <img
            src={product?.images?.[0]?.url ?? "/fallback.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                NRS {displayPrice.toFixed(2)}
              </p>
              {product.afterDiscount && (
                <p className="text-sm text-gray-500">
                  NRS {product.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {product.categoryId?.name || "Uncategorized"}
          </p>

          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(e);
            }}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
