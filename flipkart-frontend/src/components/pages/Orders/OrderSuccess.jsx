import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Button from '../../common/Button';

const OrderSuccess = () => {
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
          
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Placed!</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Thank you for your purchase. Your order has been recorded and is waiting for payment confirmation.
          </p>

          <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">
              Check your email for the order summary and payment details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;