import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import ProductList from '../Products/ProductList';
import Loader from '../../common/Loader';
import axiosInstance from '../../../api/axiosConfig';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [settings, setSettings] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    fetchSettings();
  }, [dispatch]);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/products/settings');
      setSettings(response.data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  useEffect(() => {
    if (settings && settings.offerEnabled && settings.offerExpiry) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(settings.offerExpiry).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeLeft('Offer Ended');
          clearInterval(timer);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [settings]);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Offer Banner */}
        {settings && settings.offerEnabled && timeLeft !== 'Offer Ended' && (
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-xl mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-extrabold uppercase tracking-wider">Flat {settings.offerPercentage}% OFF!</h2>
                <p className="text-orange-100">Special offer on all products. Limited time only!</p>
              </div>
            </div>
            <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20 backdrop-blur-sm">
              <span className="text-sm font-bold uppercase tracking-widest mr-2">Ends in:</span>
              <span className="text-xl font-black font-mono">{timeLeft}</span>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-blue-600 rounded-2xl p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Big Savings, <br />Big Style!
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Shop the latest trends in electronics, fashion, and more. 
              Exclusive deals for our members.
            </p>
            <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition shadow-md">
              Shop Now
            </button>
          </div>
          <div className="md:w-1/3">
            <img 
              src="https://img.freepik.com/free-photo/ecommerce-shopping-online-concept_53876-133934.jpg?w=826" 
              alt="Promo" 
              className="rounded-xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              className="px-6 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50 text-sm font-bold text-gray-700"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">
              {searchTerm || selectedCategory ? 'Filtered Products' : 'Featured Products'}
            </h2>
            { (searchTerm || selectedCategory) && (
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('');}}
                className="text-blue-600 font-semibold hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;