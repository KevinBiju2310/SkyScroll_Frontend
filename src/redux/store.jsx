import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage for persistence
import userReducer from "./userSlice";
import bookingReducer from "./bookingSlice";

const persistConfig = {
  key: "root",
  storage,
  // whitelist:["user"]
};

const rootReducer = combineReducers({
  user: userReducer,
  bookings: bookingReducer,
});

// Apply persistReducer to only the user part of the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// Initialize the persistor
export const persistor = persistStore(store);
export default store;
