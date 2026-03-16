import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalStats, fetchTopProducts, fetchDailyRevenue, fetchAllOrders, updateOrderStatus } from '../../features/admin/adminSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Loader from '../../common/Loader';
import Button from '../../common/Button';
import axiosInstance from '../../../api/axiosConfig';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, topProducts, dailyRevenue, orders, loading } = useSelector((state) => state.admin);
  const [updatingId, setUpdatingId] = useState(null);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
  
  // Settings State
  const [settings, setSettings] = useState({
    platformFee: 1, // Default to 1 to match backend validation
    offerPercentage: 0,
    offerEnabled: false,
    offerExpiry: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [offerDays, setOfferDays] = useState(0);
  const [offerHours, setOfferHours] = useState(0);

  useEffect(() => {
    dispatch(fetchTotalStats());
    dispatch(fetchTopProducts());
    dispatch(fetchDailyRevenue());
    dispatch(fetchAllOrders());
    fetchSettings();
  }, [dispatch]);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/admin/settings');
      setSettings(response.data);
      if (response.data.offerExpiry) {
        const expiry = new Date(response.data.offerExpiry);
        const now = new Date();
        const diff = expiry - now;
        if (diff > 0) {
          setOfferDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
          setOfferHours(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleSaveSettings = async () => {
    // Frontend Validation
    if (settings.platformFee < 1 || settings.platformFee > 500) {
      alert("Platform fee must be between 1 and 500.");
      return;
    }
    if (settings.offerPercentage < 0) {
      alert("Offer percentage cannot be negative.");
      return;
    }

    setSavingSettings(true);
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(offerDays));
      expiryDate.setHours(expiryDate.getHours() + parseInt(offerHours));
      
      const updatedSettings = {
        ...settings,
        offerExpiry: expiryDate.toISOString()
      };
      
      await axiosInstance.put('/admin/settings', updatedSettings);
      alert('Settings updated successfully');
      fetchSettings();
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).join('\n');
        alert('Failed to update settings:\n' + errorMessages);
      } else {
        alert('Failed to update settings');
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(orderSearchTerm) || 
                          (order.customerName && order.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()));
    const matchesStatus = selectedOrderStatus === '' || order.status === selectedOrderStatus;
    return matchesSearch && matchesStatus;
  });

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

        {/* Global Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Global Platform Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Platform Fee */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-700">Platform Fee</h3>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Fee Amount (₹)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={settings.platformFee}
                  onChange={(e) => setSettings({...settings, platformFee: e.target.value})}
                />
              </div>
            </div>

            {/* Offer Settings */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-700">Promotional Offer</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.offerEnabled}
                    onChange={(e) => setSettings({...settings, offerEnabled: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">{settings.offerEnabled ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Offer Percentage (%)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={settings.offerPercentage}
                    onChange={(e) => setSettings({...settings, offerPercentage: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Duration (Days)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={offerDays}
                    onChange={(e) => setOfferDays(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Duration (Hours)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={offerHours}
                    onChange={(e) => setOfferHours(e.target.value)}
                  />
                </div>
              </div>
              
              {settings.offerExpiry && (
                <p className="text-xs text-blue-600 font-semibold mt-2">
                  Current Expiry: {new Date(settings.offerExpiry).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveSettings}
              loading={savingSettings}
              className="px-8"
            >
              Update All Settings
            </Button>
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8 lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Order Management Lifecycle
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={selectedOrderStatus}
                  onChange={(e) => setSelectedOrderStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="CREATED">Created</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
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
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-gray-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
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
                    ))
                  )}
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