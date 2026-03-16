import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, cancelOrder } from '../../features/orders/orderSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Button from '../../common/Button';
import Loader from '../../common/Loader';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleCancel = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder({ orderId, performedBy: user?.email }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Check the status of your recent orders</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900">No orders yet</p>
            <p className="text-gray-500 mt-2 mb-6">Looks like you haven't placed any orders yet.</p>
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Number</span>
                    <h3 className="text-lg font-extrabold text-gray-900">#{order.id}</h3>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Date Placed</span>
                      <span className="text-sm font-semibold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center group">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2 mr-4 border border-gray-100">
                          {item.productImage ? (
                            <img src={item.productImage} alt="" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.productName}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} • ₹{item.priceAtPurchase.toLocaleString()} each</p>
                        </div>
                        <p className="text-sm font-extrabold text-gray-900">₹{(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Total Amount</span>
                    <span className="text-xl font-extrabold text-blue-600">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  {(order.status === 'CREATED' || order.status === 'CONFIRMED') && (
                    <Button
                      onClick={() => handleCancel(order.id)}
                      variant="danger"
                      size="sm"
                      className="shadow-sm"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;