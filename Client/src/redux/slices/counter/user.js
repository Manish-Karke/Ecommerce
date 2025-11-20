import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  token: null,
  isLoggedIn: false,
  role: "",
  location: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    loggedOut: (state) => {
      return initialState;
    },
    addLogginedDetail: (state, action) => {
      return {
        ...state,
        email: action.payload.user?.email,
        token:action.payload.user?.token,
        isLoggedIn: action.payload?.isLoggedIn,
        role: action.payload?.user.role,
        _id: action.payload?.user._id,
        location: action.payload?.user.location,
      };
    },
  },
});

export const { loggedOut, addLogginedDetail } = userSlice.actions;

export default userSlice.reducer;
