import React, { useEffect, useState, useCallback } from 'react'; // useCallback add panniruken
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalStats, fetchTopProducts, fetchDailyRevenue, fetchAllOrders, updateOrderStatus } from '../../features/admin/adminSlice';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import Loader from '../../common/Loader';
import Button from '../../common/Button';
import axiosInstance from '../../../api/axiosConfig';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  // 'dailyRevenue' ah remove pannitten variable list-la irunthu
  const { stats, topProducts, orders, loading } = useSelector((state) => state.admin);
  const [updatingId, setUpdatingId] = useState(null);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
  
  // Settings State
  const [settings, setSettings] = useState({
    platformFee: 1, 
    offerPercentage: 0,
    offerEnabled: false,
    offerExpiry: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [offerDays, setOfferDays] = useState(0);
  const [offerHours, setOfferHours] = useState(0);

  // fetchSettings ah useCallback-la wrap panniruken dependency error varaama irukka
  const fetchSettings = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    dispatch(fetchTotalStats());
    dispatch(fetchTopProducts());
    dispatch(fetchDailyRevenue());
    dispatch(fetchAllOrders());
    fetchSettings();
  }, [dispatch, fetchSettings]); // fetchSettings dependency list-la add panniyaachu

  const handleSaveSettings = async () => {
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
        dispatch(fetchAllOrders());
        dispatch(fetchTotalStats());
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
        
        {/* Render stats cards, settings, and tables (as per your original code) */}
        {/* ... (remaining JSX stays the same) ... */}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
