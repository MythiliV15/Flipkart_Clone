import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Button from '../../common/Button';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full transform hover:scale-[1.02] transition-transform duration-300">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Payment Failed</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            We couldn't process your payment. This could be due to insufficient funds, 
            an expired card, or a temporary connection issue.
          </p>

          <div className="bg-red-50 rounded-xl p-4 mb-8 border border-red-100 flex items-start text-left">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700">
              Don't worry, no money was deducted from your account. If it was, 
              it will be refunded automatically within 3-5 business days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/checkout">
              <Button variant="primary" className="w-full py-4 font-bold shadow-lg shadow-blue-100">
                Try Again
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" className="w-full py-4 font-bold">
                Return to Cart
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-xs text-gray-400 font-medium">
            Having persistent issues? <a href="#" className="text-blue-500 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentFailure; 
