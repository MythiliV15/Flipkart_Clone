import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import ProductList from '../Products/ProductList';
import Loader from '../../common/Loader';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
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

        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">
              Featured Products
            </h2>
            <button className="text-blue-600 font-semibold hover:underline">
              View All
            </button>
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
            <ProductList products={products} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;