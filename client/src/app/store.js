import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dealerReducer from '../features/dealers/dealerSlice';
import warehouseReducer from '../features/warehouses/warehouseSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dealers: dealerReducer,
    warehouses: warehouseReducer,
  },
});


