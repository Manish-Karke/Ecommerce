import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  token: null,
  isLoggedIn: false,
  role: "",
  _id: "",
  location: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loggedOut: (state) => {
      // ✅ Better: Use Object.assign to reset
      Object.assign(state, initialState);
    },
    
    addLogginedDetail: (state, action) => {
      // ✅ Better: Direct mutation (Immer handles it)
      state.email = action.payload.user?.email || "";
      state.token = action.payload.user?.token || null;
      state.isLoggedIn = action.payload?.isLoggedIn || false;
      state.role = action.payload?.user?.role || "";
      state._id = action.payload?.user?._id || "";
      state.location = action.payload?.user?.location || "";
    },
  },
});

export const { loggedOut, addLogginedDetail } = userSlice.actions;
export default userSlice.reducer;