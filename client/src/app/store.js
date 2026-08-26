import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dealerReducer from '../features/dealers/dealerSlice';
import warehouseReducer from '../features/warehouses/warehouseSlice';
import productReducer from '../features/products/productSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import orderReducer from '../features/orders/orderSlice';
import paymentReducer from '../features/payments/paymentSlice';
import supplierReducer from '../features/suppliers/supplierSlice';
import purchaseReducer from '../features/purchases/purchaseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dealers: dealerReducer,
    warehouses: warehouseReducer,
    products: productReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
    payments: paymentReducer,
    suppliers: supplierReducer,
    purchases: purchaseReducer,
  },
});