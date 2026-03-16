import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { removeFromCart, updateQuantity, syncCart } from '../../features/cart/cartSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Button from '../../common/Button';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(syncCart());
  }, [dispatch]);

  const handleQuantityChange = (id, currentQty, delta) => {
    const newQuantity = currentQty + delta;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity, userId: user?.id }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart({ productId: id, userId: user?.id }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/">
              <Button variant="primary" size="lg" className="w-full">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
          Shopping Cart
          <span className="ml-4 text-sm font-normal text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
            {items.reduce((acc, item) => acc + item.quantity, 0)} Items
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center group hover:shadow-md transition-shadow">
                <div className="w-28 h-28 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-2 mr-6">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{item.name}</h3>
                      <p className="text-blue-600 font-bold">₹{item.price.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove Item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-extrabold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Price Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({items.length} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between text-xl font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 text-lg font-bold shadow-lg shadow-blue-100"
              >
                Place Order
              </Button>
              
              <p className="mt-4 text-xs text-center text-gray-400">
                Safe and Secure Payments. 100% Authentic products.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;