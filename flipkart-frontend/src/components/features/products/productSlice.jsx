import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosConfig';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const response = await axiosInstance.get('/products');
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async (keyword) => {
    const response = await axiosInstance.get(`/products/search?keyword=${keyword}`);
    return response.data;
  }
);

export const fetchVendorProducts = createAsyncThunk(
  'products/fetchVendor',
  async () => {
    const response = await axiosInstance.get('/vendor/products');
    return response.data;
  }
);

export const addProduct = createAsyncThunk(
  'products/add',
  async (productData) => {
    const response = await axiosInstance.post('/vendor/products', productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }) => {
    const response = await axiosInstance.put(`/vendor/products/${id}`, productData);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id) => {
    await axiosInstance.delete(`/vendor/products/${id}`);
    return id;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Vendor Products
      .addCase(fetchVendorProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch By ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      // Add
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;