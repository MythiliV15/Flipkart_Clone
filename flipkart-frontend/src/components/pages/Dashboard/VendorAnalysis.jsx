import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Loader from '../../common/Loader';

const VendorAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axiosInstance.get('/vendor/analysis');
        setAnalysis(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <Loader />
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Sales Analysis</h1>
            <p className="text-gray-500 mt-1">Track your product performance and revenue</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{analysis?.totalOrders || 0}</h2>
              <p className="text-xs text-gray-500 mt-2">Orders containing your products</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Products Sold</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{analysis?.totalProductsSold || 0}</h2>
              <p className="text-xs text-gray-500 mt-2">Total units sold across all orders</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
              <h2 className="text-3xl font-extrabold text-blue-600 mt-1">₹{analysis?.totalRevenue?.toLocaleString() || '0'}</h2>
              <p className="text-xs text-gray-500 mt-2">Total earnings from product sales</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VendorAnalysis;
