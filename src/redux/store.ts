import { configureStore } from '@reduxjs/toolkit';
import productReducer from './product/ProductSlice';
import categoryReducer from './category/CategorySlice';

// Define the store configuration
export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
