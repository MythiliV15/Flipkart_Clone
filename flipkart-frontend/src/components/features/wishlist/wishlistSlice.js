import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosConfig';

// Async thunks
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/wishlist');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addToWishlistAsync = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const removeFromWishlistAsync = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/wishlist/${productId}`);
    return productId;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        // Avoid duplicates
        const alreadyIn = state.items.find(
          (i) => i.product?.id === action.payload.product?.id
        );
        if (!alreadyIn) {
          state.items.push(action.payload);
        }
      })
      // Remove from wishlist
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        const productId = action.payload;
        state.items = state.items.filter((i) => i.product?.id !== productId);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
