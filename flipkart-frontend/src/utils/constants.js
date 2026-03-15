// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAILS: '/products',
    SEARCH: '/products/search',
    CATEGORY: '/products/category',
  },
  VENDOR: {
    PRODUCTS: '/vendor/products',
    DASHBOARD: '/vendor/dashboard',
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAILS: '/orders',
    CANCEL: '/orders',
    CHECKOUT: '/orders/checkout-session',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
  },
  PAYMENT: {
    SUCCESS: '/payment-success',
    FAILURE: '/payment-failure',
    WEBHOOK: '/hooks/stripe',
  },
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN',
};

// Order Status
export const ORDER_STATUS = {
  CREATED: 'CREATED',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_COLORS = {
  CREATED: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'CARD',
  UPI: 'UPI',
  NET_BANKING: 'NET_BANKING',
  COD: 'COD',
};

// Categories
export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Toys',
  'Beauty',
  'Grocery',
];

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 20, 50, 100],
};

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format',
  },
  PASSWORD: {
    minLength: 6,
    message: 'Password must be at least 6 characters',
  },
  PHONE: {
    pattern: /^[0-9]{10}$/,
    message: 'Invalid phone number',
  },
};

// Currency Format
export const CURRENCY_FORMAT = {
  locale: 'en-IN',
  currency: 'INR',
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat(CURRENCY_FORMAT.locale, {
    style: 'currency',
    currency: CURRENCY_FORMAT.currency,
  }).format(amount);
};

// Date Format
export const DATE_FORMAT = {
  locale: 'en-IN',
  options: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat(DATE_FORMAT.locale, DATE_FORMAT.options).format(new Date(date));
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Something went wrong. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful! Please login.',
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  PRODUCT_ADDED: 'Product added successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Stripe Configuration
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key',
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Flipkart Clone',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@flipkartclone.com',
};