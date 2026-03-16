import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = (userId) => {
  if (!userId) return [];
  try {
    const cart = localStorage.getItem(`cart_${userId}`);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    return [];
  }
};

const saveCartToStorage = (cart, userId) => {
  if (!userId) return;
  localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
};

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart: (state, action) => {
      const userId = action.payload;
      state.items = loadCartFromStorage(userId);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    addToCart: (state, action) => {
      const { item: product, userId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        state.items.push(product);
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      saveCartToStorage(state.items, userId);
    },
    removeFromCart: (state, action) => {
      const { productId, userId } = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      saveCartToStorage(state.items, userId);
    },
    updateQuantity: (state, action) => {
      const { id, quantity, userId } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== item.id);
        }
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      saveCartToStorage(state.items, userId);
    },
    clearCart: (state, action) => {
      const userId = action.payload;
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      if (userId) {
        saveCartToStorage([], userId);
      }
    },
    syncCart: (state) => {
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
});

export const {
  initializeCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCart,
} = cartSlice.actions;
export default cartSlice.reducer;