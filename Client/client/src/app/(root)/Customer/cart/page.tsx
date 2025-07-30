// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
// import { useCart } from "@/contexts/cart-context";

// export default function CartPage() {
//   const { state, dispatch } = useCart();

//   const updateQuantity = (id: string, quantity: number) => {
//     dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
//   };

//   const removeItem = (id: string) => {
//     dispatch({ type: "REMOVE_ITEM", payload: id });
//   };

//   const clearCart = () => {
//     dispatch({ type: "CLEAR_CART" });
//   };

//   if (state.items.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="text-center">
//           <div className="mb-8">
//             <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">
//               Your cart is empty
//             </h1>
//             <p className="text-gray-600 mb-8">
//               Looks like you haven't added any items to your cart yet.
//             </p>
//             <Link href="/products">
//               <Button size="lg">Start Shopping</Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <Link
//           href="/products"
//           className="inline-flex items-center text-primary hover:underline mb-4"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Continue Shopping
//         </Link>
//         <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
//         <p className="text-gray-600 mt-2">
//           {state.itemCount} {state.itemCount === 1 ? "item" : "items"} in your
//           cart
//         </p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2 space-y-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">Cart Items</h2>
//             <Button variant="outline" size="sm" onClick={clearCart}>
//               <Trash2 className="h-4 w-4 mr-2" />
//               Clear Cart
//             </Button>
//           </div>

//           {state.items.map((item) => (
//             <Card key={item.id}>
//               <CardContent className="p-6">
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   {/* Product Image */}
//                   <div className="flex-shrink-0">
//                     {/* <Image
//                       src={item.image || "/placeholder.svg"}
//                       alt={item.name}
//                       width={120}
//                       height={120}
//                       className="w-24 h-24 sm:w-30 sm:h-30 object-cover rounded-lg"
//                     /> */}
//                   </div>

//                   {/* Product Details */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
//                           {item.name}
//                         </h3>
//                         <p className="text-sm text-gray-600">{item.category}</p>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => removeItem(item.id)}
//                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>

//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                       {/* Price */}
//                       <div className="flex items-center space-x-2">
//                         <span className="text-lg font-bold text-primary">
//                           ${item.price.toFixed(2)}
//                         </span>
//                         {item.originalPrice && (
//                           <span className="text-sm text-gray-500 line-through">
//                             ${item.originalPrice.toFixed(2)}
//                           </span>
//                         )}
//                       </div>

//                       {/* Quantity Controls */}
//                       <div className="flex items-center space-x-3">
//                         <span className="text-sm text-gray-600">Qty:</span>
//                         <div className="flex items-center border rounded-md">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() =>
//                               updateQuantity(item.id, item.quantity - 1)
//                             }
//                             disabled={item.quantity <= 1}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Minus className="h-4 w-4" />
//                           </Button>
//                           <Input
//                             type="number"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               updateQuantity(
//                                 item.id,
//                                 Number.parseInt(e.target.value) || 1
//                               )
//                             }
//                             className="w-16 h-8 text-center border-0 focus:ring-0"
//                             min="1"
//                           />
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() =>
//                               updateQuantity(item.id, item.quantity + 1)
//                             }
//                             className="h-8 w-8 p-0"
//                           >
//                             <Plus className="h-4 w-4" />
//                           </Button>
//                         </div>
//                         <span className="text-sm font-medium min-w-0">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <Card className="sticky top-24">
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Subtotal ({state.itemCount} items)</span>
//                   <span>${state.total.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Shipping</span>
//                   <span className="text-green-600">Free</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Tax</span>
//                   <span>${(state.total * 0.08).toFixed(2)}</span>
//                 </div>
//                 <Separator />
//                 <div className="flex justify-between text-lg font-semibold">
//                   <span>Total</span>
//                   <span>${(state.total * 1.08).toFixed(2)}</span>
//                 </div>
//               </div>

//               <Button className="w-full" size="lg">
//                 Proceed to Checkout
//               </Button>

//               <div className="text-center">
//                 <Link
//                   href="/products"
//                   className="text-sm text-primary hover:underline"
//                 >
//                   Continue Shopping
//                 </Link>
//               </div>

//               {/* Security Badge */}
//               <div className="text-center pt-4 border-t">
//                 <p className="text-xs text-gray-500">
//                   🔒 Secure checkout with SSL encryption
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
