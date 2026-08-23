import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dealerReducer from '../features/dealers/dealerSlice';
import warehouseReducer from '../features/warehouses/warehouseSlice';
import productReducer from '../features/products/productSlice';
import inventoryReducer from '../features/inventory/inventorySlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    dealers: dealerReducer,
    warehouses: warehouseReducer,
    products: productReducer,
    inventory: inventoryReducer,
  },
});


