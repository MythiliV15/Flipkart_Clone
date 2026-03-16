import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWishlist, removeFromWishlistAsync } from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    } else {
      navigate('/login');
    }
  }, [dispatch, user, navigate]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlistAsync(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      item: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      },
      userId: user.id,
    }));
    alert(`"${product.name}" added to cart!`);
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    dispatch(removeFromWishlistAsync(product.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-xs">
              Save items you love. Your wishlist will save each item so you can come back and buy later.
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          /* Grid of wishlist items */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((wishlistItem) => {
              const product = wishlistItem.product;
              if (!product) return null;
              return (
                <div
                  key={wishlistItem.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col"
                >
                  {/* Product Image */}
                  <Link to={`/products/${product.id}`} className="relative block bg-gray-50 h-52 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                      />
                    ) : (
                      <span className="text-gray-300 text-xs font-bold uppercase">No Image</span>
                    )}
                    {/* Remove from wishlist button */}
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemove(product.id); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-pink-500 hover:bg-pink-50 hover:text-pink-600 transition-all border border-pink-100"
                      title="Remove from wishlist"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Stock badge */}
                    {product.stock <= 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/70 text-white text-xs font-bold text-center py-1.5 tracking-wider uppercase">
                        Out of Stock
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs text-blue-500 font-semibold uppercase tracking-widest mb-1">
                      {product.category}
                    </span>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-extrabold text-gray-900 mb-4">
                      ₹{product.price?.toLocaleString()}
                    </p>

                    {/* Action buttons */}
                    <div className="mt-auto space-y-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={product.stock <= 0}
                        className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-blue-100"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-red-200 hover:text-red-500 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
