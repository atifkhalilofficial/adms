import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dealerReducer from '../features/dealers/dealerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dealers: dealerReducer,
  },
});