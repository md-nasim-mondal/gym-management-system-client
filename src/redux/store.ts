import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import scheduleReducer from "./features/schedule/scheduleSlice";
import bookingReducer from "./features/booking/bookingSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // শুধুমাত্র auth স্টেট পারসিস্ট করবে
};

const rootReducer = combineReducers({
  auth: authReducer,
  schedule: scheduleReducer,
  booking: bookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
