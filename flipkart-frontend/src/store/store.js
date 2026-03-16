import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../components/features/auth/authSlice';
import productReducer from '../components/features/products/productSlice';
import cartReducer from '../components/features/cart/cartSlice';
import orderReducer from '../components/features/orders/orderSlice';
import adminReducer from '../components/features/admin/adminSlice';
import wishlistReducer from '../components/features/wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    admin: adminReducer,
    wishlist: wishlistReducer,
  },
});