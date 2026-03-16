import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalStats, fetchTopProducts, fetchDailyRevenue, fetchAllOrders, updateOrderStatus } from '../../features/admin/adminSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Loader from '../../common/Loader';
import Button from '../../common/Button';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, topProducts, dailyRevenue, orders, loading } = useSelector((state) => state.admin);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchTotalStats());
    dispatch(fetchTopProducts());
    dispatch(fetchDailyRevenue());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'CREATED') nextStatus = 'CONFIRMED';
    else if (currentStatus === 'CONFIRMED') nextStatus = 'SHIPPED';
    else if (currentStatus === 'SHIPPED') nextStatus = 'DELIVERED';
    
    if (!nextStatus) return;

    if (window.confirm(`Update order #${orderId} from ${currentStatus} to ${nextStatus}?`)) {
      setUpdatingId(orderId);
      try {
        await dispatch(updateOrderStatus({ orderId, status: nextStatus })).unwrap();
        dispatch(fetchAllOrders()); // Refresh list
        dispatch(fetchTotalStats()); // Refresh revenue if delivered
      } catch (err) {
        alert(err.message || 'Failed to update status');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm(`Are you sure you want to CANCEL order #${orderId}?`)) {
      setUpdatingId(orderId);
      try {
        await dispatch(updateOrderStatus({ orderId, status: 'CANCELLED' })).unwrap();
        dispatch(fetchAllOrders());
      } catch (err) {
        alert(err.message || 'Failed to cancel order');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Global store performance and management</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats?.totalOrders?.toLocaleString() || 0}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Revenue</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Users</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats?.totalUsers?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Products</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats?.totalProducts?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Top Selling Products
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2">
                    <th className="py-3">Product</th>
                    <th className="py-3 text-center">Units</th>
                    <th className="py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm font-semibold text-gray-700">{product.productName}</td>
                      <td className="py-4 text-sm text-gray-600 text-center font-bold">{product.totalQuantity}</td>
                      <td className="py-4 text-sm font-extrabold text-gray-900 text-right">₹{product.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Orders
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2">
                    <th className="py-3">Order</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(0, 8).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="text-sm font-semibold text-gray-900">#{order.id}</div>
                        <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-extrabold text-gray-900 text-right">₹{order.totalAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* All Orders Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Order Management Lifecycle
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2">
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Current Status</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm font-bold text-gray-900">#{order.id}</td>
                      <td className="py-4">
                        <div className="text-sm font-medium text-gray-700">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-extrabold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleStatusUpdate(order.id, order.status)}
                                loading={updatingId === order.id}
                                className="text-[10px] py-1 h-auto"
                              >
                                {order.status === 'CREATED' ? 'Confirm' : 
                                 order.status === 'CONFIRMED' ? 'Ship' : 'Deliver'}
                              </Button>
                              
                              {order.status !== 'SHIPPED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancel(order.id)}
                                  disabled={updatingId === order.id}
                                  className="text-[10px] py-1 h-auto text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Cancel
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;