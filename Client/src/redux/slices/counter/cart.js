// slices/counter/cart.js   (or wherever it is)
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // redux-persist will hydrate this automatically
  },
  reducers: {
    addItem(state, action) {
      const { id, name, price, image } = action.payload;
      const existing = state.items.find((item) => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id,
          name,
          price,
          image: image || "/placeholder.jpg",
          quantity: 1,
        });
      }
    },

    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    incrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        } else {
          item.quantity -= 1;
        }
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
