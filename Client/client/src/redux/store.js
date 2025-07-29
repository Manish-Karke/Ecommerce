import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "redux";

import userReducer from "./slices/counter/user";
import boxReducer from "./slices/counter/box";
import circleReducer from "./slices/counter/circle";

const rootReducer = combineReducers({
  user: userReducer,
  box: boxReducer,
  circle: circleReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only persist user state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Important for redux-persist
    }),
});

export const persistor = persistStore(store);
