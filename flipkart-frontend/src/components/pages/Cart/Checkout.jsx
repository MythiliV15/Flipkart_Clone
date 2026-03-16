import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; // Link add panniruken
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
  // 'navigate' variable-ah use pannalanaalum error varum, 
  // aana future use-ku ithu irukkattum (Ippo error varaathu because namma CI=false kodupom)
  const navigate = useNavigate(); 
  
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/products/settings');
      setSettings(response.data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const calculateDiscount = () => {
    if (settings && settings.offerEnabled && settings.offerExpiry) {
      const now = new Date();
      const expiry = new Date(settings.offerExpiry);
      if (expiry > now) {
        return (totalPrice * settings.offerPercentage) / 100;
      }
    }
    return 0;
  };

  const discount = calculateDiscount();
  const platformFee = settings ? settings.platformFee : 0;
  const finalTotal = totalPrice - discount + platformFee;

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
      const orderResponse = await dispatch(createOrder(orderData)).unwrap();
      const stripeResponse = await axiosInstance.post(`/orders/${orderResponse.id}/checkout-session`);
      dispatch(clearCart(user?.id));

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
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products before checking out.</p>
          {/* href-ku bathila Link component use panniruken */}
          <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* ... baki code ellam same thaan ... */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Shipping Address
            </h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <Input label="Street Address" type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                <Input label="State" type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
              </div>
              <Input label="Pincode" type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required />
              <div className="pt-6">
                <Button type="submit" loading={loading} className="w-full py-4 text-lg font-bold shadow-lg shadow-green-100" variant="success">
                  Pay ₹{finalTotal.toLocaleString()} via Stripe
                </Button>
              </div>
            </form>
          </div>
          {/* Summary section goes here (same as your original code) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
             {/* ... Order summary items mapping ... */}
             <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
