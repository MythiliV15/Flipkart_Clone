import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosConfig';

export const fetchTotalStats = createAsyncThunk(
  'admin/fetchStats',
  async () => {
    const response = await axiosInstance.get('/admin/reports/total-stats');
    return response.data;
  }
);

export const fetchTopProducts = createAsyncThunk(
  'admin/fetchTopProducts',
  async (limit = 10) => {
    const response = await axiosInstance.get(`/admin/reports/top-products?limit=${limit}`);
    return response.data;
  }
);

export const fetchDailyRevenue = createAsyncThunk(
  'admin/fetchRevenue',
  async (days = 30) => {
    const response = await axiosInstance.get(`/admin/reports/daily-revenue?days=${days}`);
    return response.data;
  }
);

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchOrders',
  async () => {
    const response = await axiosInstance.get('/admin/orders');
    return response.data;
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }) => {
    const response = await axiosInstance.post(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    topProducts: [],
    dailyRevenue: [],
    orders: [],
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminData: (state) => {
      state.stats = null;
      state.topProducts = [];
      state.dailyRevenue = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProducts = action.payload;
      })
      .addCase(fetchDailyRevenue.fulfilled, (state, action) => {
        state.dailyRevenue = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const { clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;