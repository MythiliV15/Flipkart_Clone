import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelectedProduct } from '../../features/products/productSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import { addToCart } from '../../features/cart/cartSlice';
import {
  addToWishlistAsync,
  removeFromWishlistAsync,
} from '../../features/wishlist/wishlistSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  const isInWishlist = wishlistItems.some(
    (wi) => wi.product?.id === selectedProduct?.id
  );

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    dispatch(addToCart({
      item: {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        imageUrl: selectedProduct.imageUrl,
        quantity: 1,
      },
      userId: user.id,
    }));
    setCartMessage('✓ Added to cart!');
    setTimeout(() => setCartMessage(''), 2500);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please login to buy this item');
      return;
    }
    // Add to cart first, then navigate to checkout
    dispatch(addToCart({
      item: {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        imageUrl: selectedProduct.imageUrl,
        quantity: 1,
      },
      userId: user.id,
    }));
    // Navigate directly to checkout page
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    if (!user) {
      alert('Please login to manage your wishlist');
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlistAsync(selectedProduct.id));
    } else {
      dispatch(addToWishlistAsync(selectedProduct.id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-6 text-center">
          <p className="text-xl text-gray-600 mt-10">Product not found</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 max-w-6xl">
        <Link to="/" className="text-blue-600 hover:underline mb-6 inline-flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="bg-gray-50 rounded-xl flex items-center justify-center p-4 min-h-[400px] relative">
              {selectedProduct.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>No Image Available</span>
                </div>
              )}

              {/* Wishlist heart button on image */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 border ${
                  isInWishlist
                    ? 'bg-pink-500 border-pink-500 text-white scale-110'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-pink-400 hover:text-pink-500'
                }`}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex-1">
                <nav className="text-sm text-gray-500 mb-2">{selectedProduct.category}</nav>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-extrabold text-blue-600">
                    ₹{selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.stock > 0 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="prose prose-sm text-gray-600 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
                  <div>
                    <span className="block font-medium text-gray-400">Seller</span>
                    <span className="font-semibold text-gray-900">{selectedProduct.vendorName}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-400">Stock Remaining</span>
                    <span className="font-semibold text-gray-900">{selectedProduct.stock} units</span>
                  </div>
                </div>
              </div>

              {/* Cart message toast */}
              {cartMessage && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-semibold flex items-center gap-2 animate-pulse">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {cartMessage}
                </div>
              )}

              <div className="mt-6 space-y-3">
                {/* Add to Cart */}
                <button
                  id="btn-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={selectedProduct.stock <= 0}
                  className={`w-full py-4 text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-3 ${
                    selectedProduct.stock > 0
                      ? 'bg-amber-400 hover:bg-amber-500 text-gray-900 shadow-lg shadow-amber-100'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {selectedProduct.stock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
                </button>

                {/* Buy Now */}
                <button
                  id="btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={selectedProduct.stock <= 0}
                  className={`w-full py-4 text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-3 ${
                    selectedProduct.stock > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {selectedProduct.stock > 0 ? 'Buy Now' : 'Currently Unavailable'}
                </button>

                {/* Wishlist text button */}
                <button
                  id="btn-wishlist"
                  onClick={handleToggleWishlist}
                  className={`w-full py-3 text-sm font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    isInWishlist
                      ? 'border-pink-300 bg-pink-50 text-pink-600 hover:bg-pink-100'
                      : 'border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isInWishlist ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;