import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // array of cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity, ...rest } = action.payload;
      const existing = state.items.find((i) => i.id === id);

      if (existing) {
        existing.quantity += quantity; // dynamic quantity
      } else {
        state.items.push({ id, ...rest, quantity });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = quantity;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
