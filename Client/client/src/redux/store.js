import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counter/index";
import boxSlice from "./slices/counter/box.js";
import circleSlice from "./slices/counter/circle";
import { userSlice } from "./slices/counter/user.js";
export default configureStore({
  reducer: {
    user: userSlice,
    box: boxSlice,
    circle: circleSlice,
  },
});
