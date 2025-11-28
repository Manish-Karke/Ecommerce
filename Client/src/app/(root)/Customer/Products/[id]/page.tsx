// app/product/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Shield, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/counter/cart";

interface Product {
  _id: string;
  name: string;
  description: string;
  images: { url: string; _id: string }[];
  price: number;
  discount?: number;
  afterDiscount?: number;
  stock: number;
  brandId: { name: string; logo?: { url: string } };
  categoryId: { name: string };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addItem({
        id: product._id,
        name: product.name,
        price: product.afterDiscount || product.price,
        image: product.images[0],
        quantity: 1,
      })
    );

    toast.success("Added to cart!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const displayPrice = product.afterDiscount || product.price;
  const savings = product.discount ? product.price - displayPrice : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImage]?.url || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img._id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-indigo-600" : "border-gray-200"
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{product.brandId.name}</span>
              <span>•</span>
              <span>{product.categoryId.name}</span>
            </div>

            {/* Name */}
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating (fake for now) */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8 • 324 reviews)</span>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-indigo-600">
                  NRS {displayPrice.toFixed(2)}
                </span>
                {product.discount && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      NRS {product.price.toFixed(2)}
                    </span>
                    <Badge className="bg-red-100 text-red-700">
                      -{product.discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
              {savings > 0 && (
                <p className="text-green-600 font-medium">
                  You save: NRS {savings.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">
                In Stock • {product.stock} left
              </span>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Description</h3>
              <p className={`text-gray-700 leading-relaxed ${!showFullDesc ? "line-clamp-4" : ""}`}>
                {product.description || "No description available."}
              </p>
              {product.description && product.description.length > 150 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {showFullDesc ? (
                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Read More <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="font-medium">Free Delivery</span>
                <span className="text-sm text-gray-500">Above NRS 2000</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="font-medium">100% Genuine</span>
                <span className="text-sm text-gray-500">Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShoppingCart className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="font-medium">Easy Returns</span>
                <span className="text-sm text-gray-500">7 days policy</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingCart className="w-6 h-6 mr-3" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Extra Section (Optional) */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-gray-500">Brand</p>
              <p className="font-bold">{product.brandId.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-bold">{product.categoryId.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Stock</p>
              <p className="font-bold text-green-600">{product.stock} units</p>
            </div>
            <div>
              <p className="text-gray-500">Availability</p>
              <p className="font-bold text-green-600">In Stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}