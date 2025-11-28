// app/cart/page.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { addItem, decrementQuantity, removeItem } from "@/redux/slices/counter/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.cart.items);

  const totalPrice = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/Customer/Products">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2"> &gt; </span>
          <span className="text-gray-900 font-medium">Cart</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Bucket</h2>
                  <span className="text-gray-600">{items.length} {items.length === 1 ? "Item" : "Items"}</span>
                </div>
              </div>

              <div className="divide-y">
                {items.map((item: any) => (
                  <div key={item.id} className="p-6 flex gap-4 hover:bg-gray-50 transition">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image?.url || "/placeholder.jpg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-xl object-cover border"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-indigo-600 font-bold mt-2">NRS {item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 rounded-full"
                        onClick={() => dispatch(decrementQuantity(item.id))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                        onClick={() => dispatch(addItem({ ...item, quantity: 1 }))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="text-right">
                      <p className="font-bold text-lg">NRS {(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 mt-2"
                        onClick={() => dispatch(removeItem(item.id))}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Item Total</span>
                  <span>NRS {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Sub Total</span>
                  <span>NRS {totalPrice.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Input placeholder="Promo Code" className="flex-1" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                    <span>Total</span>
                    <span>NRS {totalPrice.toFixed(2)}</span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg h-14 rounded-xl"
                  >
                    CHECKOUT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}