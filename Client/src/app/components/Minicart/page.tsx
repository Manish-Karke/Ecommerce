// components/MiniCartPopover.tsx   ← THIS IS THE CORRECT PLACE
"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  decrementQuantity,
  removeItem,
} from "@/redux/slices/counter/cart";
import { ShoppingCart, Plus, Minus, X, ArrowRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MiniCartPopover() {
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.cart.items);

  const totalItems = items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );
  const totalPrice = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {totalItems}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 mr-4" align="end" sideOffset={10}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">Cart ({totalItems})</h3>
          <Link href="cart" className="text-sm text-indigo-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="max-h-96 overflow-y-auto ">
          {items.length === 0 ? (
            <p className="text-center py-12 text-gray-500">
              Your cart is empty
            </p>
          ) : (
            items.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-3 p-4 border-b hover:bg-gray-50"
              >
                <img
                  src={item.image?.url || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-indigo-600 font-bold">NRS {item.price}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => dispatch(decrementQuantity(item.id))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-bold text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => dispatch(addItem({ ...item, quantity: 1 }))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => dispatch(removeItem(item.id))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>NRS {totalPrice}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/cart">
                <Button variant="outline" className="w-full">
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout">
                <Button className="w-full">Checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
