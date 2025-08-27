// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Search, Filter, Grid, List, XCircle } from "lucide-react";
// import ProductCard from "@/components/product-cart";
// import axios from "axios";

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState(["All"]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [sortBy, setSortBy] = useState("name");
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const [showFilters, setShowFilters] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(15);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalProductsFound, setTotalProductsFound] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const API_BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

//   const fetchProducts = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         sortBy: sortBy,
//       });

//       if (searchQuery) {
//         queryParams.append("search", searchQuery);
//       }
//       if (selectedCategory !== "All") {
//         queryParams.append("category", selectedCategory);
//       }

//       const response = await axios.get(
//         `${API_BASE_URL}/product?${queryParams.toString()}`
//       );
//       const result = response.data;

//       if (response.status === 200) {
//         setProducts(result.data);
//         setTotalPages(result.options?.No_of_pages || 1);
//         setTotalProductsFound(
//           result.options?.Total_items || result.data.length
//         );
//       } else {
//         setError(result.message || "Failed to fetch products");
//       }
//     } catch (err: any) {
//       console.error("An error occurred while fetching products:", err);
//       setError(
//         err.response?.data?.message ||
//           "An error occurred while fetching products"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [page, limit, searchQuery, selectedCategory, sortBy, API_BASE_URL]);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/category`);
//         const result = response.data;
//         if (response.status === 200) {
//           setCategories(["All", ...result.data.map((cat: any) => cat.name)]);
//         } else {
//           console.error("Failed to fetch categories:", result.message);
//         }
//       } catch (err) {
//         console.error("An error occurred while fetching categories:", err);
//       }
//     };
//     fetchCategories();
//   }, [API_BASE_URL]);

//   const clientFilteredProducts = useMemo(() => {
//     return products.filter((product: any) => {
//       return (
//         product.afterDiscount >= priceRange.min &&
//         product.afterDiscount <= priceRange.max
//       );
//     });
//   }, [products, priceRange]);

//   const handlePageChange = useCallback(
//     (newPage: number) => {
//       if (newPage >= 1 && newPage <= totalPages) {
//         setPage(newPage);
//       }
//     },
//     [totalPages]
//   );

//   const handleClearFilters = useCallback(() => {
//     setSearchQuery("");
//     setSelectedCategory("All");
//     setPriceRange({ min: 0, max: 1000000 });
//     setSortBy("name");
//     setPage(1);
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
//         <p className="text-gray-600">
//           Discover our complete collection of products
//         </p>
//       </div>

//       <div className="mb-8 space-y-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           <Input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setPage(1); // Reset page on search
//             }}
//             className="pl-10 pr-4 h-12 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//           <div className="flex flex-wrap gap-4 items-center">
//             <Button
//               variant="outline"
//               onClick={() => setShowFilters(!showFilters)}
//               className="lg:hidden flex items-center gap-2 rounded-lg"
//             >
//               <Filter className="h-4 w-4" />
//               Filters
//             </Button>
//             <div
//               className={`flex flex-wrap gap-4 ${
//                 showFilters ? "block" : "hidden lg:flex"
//               }`}
//             >
//               <Select
//                 value={selectedCategory}
//                 onValueChange={(value) => {
//                   setSelectedCategory(value);
//                   setPage(1); // Reset page on category change
//                 }}
//               >
//                 <SelectTrigger className="w-48 rounded-lg">
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((category) => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select
//                 value={sortBy}
//                 onValueChange={(value) => {
//                   setSortBy(value);
//                   setPage(1); // Reset page on sort change
//                 }}
//               >
//                 <SelectTrigger className="w-48 rounded-lg">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="name">Name A-Z</SelectItem>
//                   <SelectItem value="price-low">Price: Low to High</SelectItem>
//                   <SelectItem value="price-high">Price: High to Low</SelectItem>
//                   {/* Add more sort options as needed, ensure backend supports them */}
//                 </SelectContent>
//               </Select>

//               <div className="flex items-center gap-2">
//                 <Input
//                   type="number"
//                   placeholder="Min Price"
//                   value={priceRange.min}
//                   onChange={(e) =>
//                     setPriceRange((prev) => ({
//                       ...prev,
//                       min: Number(e.target.value),
//                     }))
//                   }
//                   className="w-32 rounded-lg"
//                 />
//                 <span className="text-gray-500">-</span>
//                 <Input
//                   type="number"
//                   placeholder="Max Price"
//                   value={priceRange.max === 1000000 ? "" : priceRange.max} // Clear placeholder if default max
//                   onChange={(e) =>
//                     setPriceRange((prev) => ({
//                       ...prev,
//                       max: Number(e.target.value) || 1000000,
//                     }))
//                   }
//                   className="w-32 rounded-lg"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 mt-4 lg:mt-0">
//             <span className="text-sm text-gray-600 font-medium">
//               {totalProductsFound} products found
//             </span>
//             <div className="flex border rounded-md overflow-hidden shadow-sm">
//               <Button
//                 variant={viewMode === "grid" ? "default" : "ghost"}
//                 size="sm"
//                 onClick={() => setViewMode("grid")}
//                 className="rounded-none hover:bg-gray-100"
//               >
//                 <Grid className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant={viewMode === "list" ? "default" : "ghost"}
//                 size="sm"
//                 onClick={() => setViewMode("list")}
//                 className="rounded-none hover:bg-gray-100"
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Applied Filters Badges */}
//         {(selectedCategory !== "All" ||
//           searchQuery ||
//           priceRange.min > 0 ||
//           priceRange.max < 1000000) && (
//           <div className="flex flex-wrap gap-2 mt-4">
//             <span className="text-sm text-gray-600 font-medium mr-1">
//               Applied Filters:
//             </span>
//             {selectedCategory !== "All" && (
//               <Badge
//                 variant="secondary"
//                 className="flex items-center gap-1 rounded-full px-3 py-1 bg-blue-100 text-blue-700"
//               >
//                 Category: {selectedCategory}
//                 <button
//                   onClick={() => setSelectedCategory("All")}
//                   className="ml-1 text-blue-700 hover:text-blue-900 focus:outline-none"
//                   aria-label="Clear category filter"
//                 >
//                   <XCircle className="h-4 w-4" />
//                 </button>
//               </Badge>
//             )}
//             {searchQuery && (
//               <Badge
//                 variant="secondary"
//                 className="flex items-center gap-1 rounded-full px-3 py-1 bg-green-100 text-green-700"
//               >
//                 Search: "{searchQuery}"
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="ml-1 text-green-700 hover:text-green-900 focus:outline-none"
//                   aria-label="Clear search filter"
//                 >
//                   <XCircle className="h-4 w-4" />
//                 </button>
//               </Badge>
//             )}
//             {(priceRange.min > 0 || priceRange.max < 1000000) && (
//               <Badge
//                 variant="secondary"
//                 className="flex items-center gap-1 rounded-full px-3 py-1 bg-purple-100 text-purple-700"
//               >
//                 Price: ${priceRange.min} - ${priceRange.max}
//                 <button
//                   onClick={() => setPriceRange({ min: 0, max: 1000000 })}
//                   className="ml-1 text-purple-700 hover:text-purple-900 focus:outline-none"
//                   aria-label="Clear price filter"
//                 >
//                   <XCircle className="h-4 w-4" />
//                 </button>
//               </Badge>
//             )}
//             {(selectedCategory !== "All" ||
//               searchQuery ||
//               priceRange.min > 0 ||
//               priceRange.max < 1000000) && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleClearFilters}
//                 className="text-gray-600 hover:bg-gray-200 rounded-full text-sm py-1 px-3"
//               >
//                 Clear All
//               </Button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Loading and Error States */}
//       {isLoading && (
//         <Card className="p-12 text-center rounded-lg shadow-md">
//           <CardContent className="flex flex-col items-center justify-center">
//             <svg
//               className="animate-spin h-8 w-8 text-blue-500 mb-4"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             <p className="text-gray-700">Loading products...</p>
//           </CardContent>
//         </Card>
//       )}
//       {error && (
//         <Card className="p-12 text-center rounded-lg shadow-md border-red-300 bg-red-50">
//           <CardContent className="flex flex-col items-center justify-center">
//             <p className="text-red-600 font-semibold mb-4">{error}</p>
//             <Button
//               onClick={fetchProducts}
//               className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
//             >
//               Retry
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       {/* Products Grid / List */}
//       {!isLoading && !error && clientFilteredProducts.length > 0 ? (
//         <div
//           className={
//             viewMode === "grid"
//               ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//               : "space-y-4"
//           }
//         >
//           {clientFilteredProducts.map((product: any) => (
//             <ProductCard
//               key={product._id}
//               product={{
//                 id: product._id,
//                 name: product.name,
//                 description: product.description,
//                 price: product.afterDiscount,
//                 images: product.images[0]?.url,
//                 // Assuming your API now returns a category name directly, otherwise adjust ProductCard or fetch category names.
//                 category: product.categoryName || product.categoryId,
//               }}
//               variant={viewMode === "list" ? "compact" : "default"}
//             />
//           ))}
//         </div>
//       ) : (
//         !isLoading &&
//         !error && (
//           <Card className="p-12 text-center rounded-lg shadow-md bg-gray-50">
//             <CardContent className="flex flex-col items-center justify-center">
//               <div className="text-gray-400 mb-4">
//                 <Search className="h-16 w-16 mx-auto" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 No products found
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Try adjusting your search criteria or browse our categories.
//               </p>
//               <Button
//                 onClick={handleClearFilters}
//                 className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//               >
//                 Clear Filters
//               </Button>
//             </CardContent>
//           </Card>
//         )
//       )}

//       {/* Pagination Controls */}
//       {!isLoading && !error && totalPages > 1 && (
//         <div className="mt-10 flex justify-center items-center gap-2">
//           <Button
//             disabled={page === 1}
//             onClick={() => handlePageChange(page - 1)}
//             className="rounded-lg px-4 py-2 hover:bg-blue-100"
//             variant="outline"
//           >
//             Previous
//           </Button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//             <Button
//               key={p}
//               variant={p === page ? "default" : "outline"}
//               onClick={() => handlePageChange(p)}
//               className={`rounded-lg px-4 py-2 ${
//                 p === page ? "bg-blue-600 text-white" : "hover:bg-blue-100"
//               }`}
//             >
//               {p}
//             </Button>
//           ))}
//           <Button
//             disabled={page === totalPages}
//             onClick={() => handlePageChange(page + 1)}
//             className="rounded-lg px-4 py-2 hover:bg-blue-100"
//             variant="outline"
//           >
//             Next
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }


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
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);

  const API_BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", []);

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
        const response = await axios.get(`${API_BASE_URL}/product?search=${searchQuery}`);
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
  const addToCart = async (product: { id: string; name: string; price: number }) => {
    try {
      // Check if product is already in cart
      const existingItem = cart.find((item) => item.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }
      setCart(updatedCart);

      // Send to backend
      await axios.post(`${API_BASE_URL}/cart`, {
        productId: product.id,
        quantity: 1,
      });
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      setError(err.response?.data?.message || "Failed to add to cart");
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
                    onAddToCart={() => addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.afterDiscount,
                    })}
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