import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../features/cart/cartSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Button from '../../common/Button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    // Clear cart after successful payment
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full transform hover:scale-[1.02] transition-transform duration-300">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Payment Successful!</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Thank you for your purchase. Your order has been placed and is being processed. 
            You'll receive a confirmation email shortly.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Transaction ID</span>
              <code className="text-sm font-mono text-blue-600 break-all">{sessionId}</code>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/orders">
              <Button variant="primary" className="w-full py-4 font-bold shadow-lg shadow-blue-100">
                View My Orders
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full py-4 font-bold">
                Continue Shopping
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-xs text-gray-400 font-medium">
            Need help? <a href="#" className="text-blue-500 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;