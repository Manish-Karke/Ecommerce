export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Beauty",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Premium Cotton T-Shirt",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Clothing",
    description:
      "Comfortable 100% cotton t-shirt available in multiple colors and sizes.",
    rating: 4.2,
    reviews: 89,
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    description:
      "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Ceramic Plant Pot Set",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
    description:
      "Beautiful set of 3 ceramic plant pots perfect for indoor gardening.",
    rating: 4.3,
    reviews: 67,
    inStock: true,
  },
  {
    id: "5",
    name: "Yoga Mat Premium",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sports",
    description:
      "Non-slip yoga mat made from eco-friendly materials, perfect for all yoga practices.",
    rating: 4.6,
    reviews: 145,
    inStock: true,
  },
  {
    id: "6",
    name: "JavaScript Programming Book",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Books",
    description:
      "Complete guide to modern JavaScript programming with practical examples.",
    rating: 4.8,
    reviews: 92,
    inStock: true,
  },
  {
    id: "7",
    name: "Organic Face Cream",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Beauty",
    description:
      "Natural organic face cream with anti-aging properties and SPF protection.",
    rating: 4.4,
    reviews: 156,
    inStock: false,
  },
  {
    id: "8",
    name: "Wireless Gaming Mouse",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    description:
      "High-precision gaming mouse with customizable RGB lighting and programmable buttons.",
    rating: 4.5,
    reviews: 78,
    inStock: true,
  },
];
