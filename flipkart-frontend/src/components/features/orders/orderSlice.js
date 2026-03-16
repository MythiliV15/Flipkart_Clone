import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosConfig';

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMy',
  async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async ({ orderId, performedBy }) => {
    await axiosInstance.post(`/orders/${orderId}/cancel`, { performedBy });
    return orderId;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;