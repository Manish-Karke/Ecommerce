// "use client";
// import { removeFromCart } from "@/redux/slices/counter/cart";
// import { useSelector, useDispatch } from "react-redux";

// export default function CartPage() {
//   const items = useSelector((state) => state.cart.items);
//   const dispatch = useDispatch();

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
//       {items.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         items.map((item) => (
//           <div key={item.id} className="flex justify-between items-center mb-4">
//             <p>{item.name} (x{item.quantity})</p>
//             <button
//               onClick={() => dispatch(removeFromCart(item.id))}
//               className="text-red-500"
//             >
//               Remove
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "@/redux/slices/counter/cart";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);

  // 🔹 Access Redux state
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // 🔹 Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
      >
        Cart ({cartItems.length})
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition ease-in-out">
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  {/* Header */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">
                        Shopping cart
                      </DialogTitle>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="mt-8">
                      {cartItems.length === 0 ? (
                        <p className="text-gray-500">Your cart is empty.</p>
                      ) : (
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {cartItems.map((item) => (
                            <li key={item.id} className="flex py-6">
                              <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  alt={item.name}
                                  src={item.image}
                                  className="size-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">
                                    Rs. {item.price * item.quantity}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  Qty {item.quantity}
                                </p>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      dispatch(removeFromCart(item.id))
                                    }
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>Rs. {subtotal}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <button className="w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">
                        Checkout
                      </button>
                    </div>
                    <div className="mt-6 text-center text-sm">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping →
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
