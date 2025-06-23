import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    email: "",
    password: "",
  },
  reducers: {
    login: (state, action) => {
      (state.email = action.email), (state.password = action.password);
    },

    logout: (state, action) => {
      (state.email = null), (state.password = null);
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
