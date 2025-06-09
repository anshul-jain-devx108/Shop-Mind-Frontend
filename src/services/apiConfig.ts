
// API Configuration
// Replace these URLs with your actual backend endpoints

export const API_CONFIG = {
  // Base URL - Replace with your backend URL
  BASE_URL: "/api",// 'http://127.0.0.1:5000/api',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    GUEST: '/auth/guest',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },
  
  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    SEARCH: '/products/search',
    DETAIL: '/products/:id',
    CATEGORIES: '/products/categories'
  },
  
  // Chat endpoints - updated to match backend spec
  CHAT: {
    SESSIONS: '/chat/sessions',
    SESSION_DETAIL: '/chat/session/:sessionId',
    SEND_MESSAGE: '/chat/send',
    MESSAGES: '/chat/messages'
  }
};

// API request configuration
export const API_DEFAULTS = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
};

// Helper function to build full URLs
export const buildUrl = (endpoint: string, params?: Record<string, string>) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};
