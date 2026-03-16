import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { clearCart } from '../features/cart/cartSlice';
import { clearWishlist } from '../features/wishlist/wishlistSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            FLIPKART<span className="text-blue-600">CLONE</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>

          {isAuthenticated && user?.role === 'VENDOR' && (
            <Link to="/vendor/dashboard" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
              Vendor Panel
            </Link>
          )}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link to="/admin/dashboard" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
              Admin Panel
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/orders" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
              My Orders
            </Link>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Wishlist Icon */}
          {isAuthenticated && (
            <Link
              to="/wishlist"
              id="nav-wishlist"
              className="relative p-2 text-gray-600 hover:text-pink-500 transition-colors group"
              title="My Wishlist"
            >
              <svg className="w-6 h-6" fill={wishlistCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  className={wishlistCount > 0 ? 'text-pink-500' : ''} />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" id="nav-cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors group">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;