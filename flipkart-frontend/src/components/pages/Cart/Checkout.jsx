import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '../../../api/axiosConfig';
import { createOrder } from '../../features/orders/orderSlice';
import { clearCart } from '../../features/cart/cartSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Button from '../../common/Button';
import Input from '../../common/Input';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key');

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const orderItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      items: orderItems,
      shippingAddress: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      paymentMethod: 'CARD',
    };

    try {
      // 1. Create order
      const orderResponse = await dispatch(createOrder(orderData)).unwrap();
      
      // 2. Create Stripe session
      const stripeResponse = await axiosInstance.post(`/orders/${orderResponse.id}/checkout-session`);
      
      // 3. Clear cart
      dispatch(clearCart(user?.id));

      // 4. Redirect to Stripe
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: stripeResponse.data.sessionId,
      });
      
      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      alert('Checkout Failed: ' + (error.response?.data?.error || error.message || error));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Shipping Address
            </h2>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              <Input
                label="Street Address"
                type="text"
                placeholder="123 Main St, Apartment 4B"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  placeholder="Mumbai"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  type="text"
                  placeholder="Maharashtra"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Pincode"
                type="text"
                placeholder="400001"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                required
              />
              
              <div className="pt-6">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-4 text-lg font-bold shadow-lg shadow-green-100"
                  variant="success"
                >
                  Pay ₹{totalPrice.toLocaleString()} via Stripe
                </Button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  By clicking, you agree to our Terms of Service.
                </p>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mr-4 border border-gray-100">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-gray-300 font-bold uppercase">No Pic</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-bold text-blue-900">Secure Payment</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment details are encrypted and processed securely by Stripe. We never store your card information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;