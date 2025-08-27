import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
  };
  variant: "default" | "compact";
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant,
  onAddToCart,
}) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
        variant === "compact" ? "flex" : "block"
      }`}
      whileHover={{ y: -5 }}
    >
      <img
        src={product.images || "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <p className="text-indigo-600 font-bold mt-2">${product.price}</p>
        <p className="text-sm text-gray-500">{product.category}</p>
        <Button
          onClick={onAddToCart}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
