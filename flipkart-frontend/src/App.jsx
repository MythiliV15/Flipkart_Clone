import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeCart } from './components/features/cart/cartSlice';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home/Home';
import ProductDetails from './components/pages/Products/ProductDetails';
import VendorDashboard from './components/pages/Dashboard/VendorDashboard';
import ProtectedRoute from './components/protected/ProtectedRoute';
import Cart from './components/pages/Cart/Cart';
import Checkout from './components/pages/Cart/Checkout';
import OrderSuccess from './components/pages/Orders/OrderSuccess';
import AdminDashboard from './components/pages/Dashboard/AdminDashboard';
import OrderHistory from './components/pages/Orders/OrderHistory';
import PaymentSuccess from './components/pages/Orders/PaymentSuccess';
import PaymentFailure from './components/pages/Orders/PaymentFailure';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.id) {
      dispatch(initializeCart(user.id));
    }
  }, [user, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;