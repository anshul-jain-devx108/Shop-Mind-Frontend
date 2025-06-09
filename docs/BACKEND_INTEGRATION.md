
# Backend Integration Guide for ShopMind

This guide provides comprehensive documentation for integrating your backend API with the ShopMind frontend application.

## Overview

The ShopMind application requires backend APIs for:
- User authentication
- Product management and search
- Chat analytics and session management

## Quick Setup

1. Set your backend URL in environment variables:
   ```bash
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

2. Replace the hooks in your components:
   ```typescript
   // Replace existing hooks
   import { useProducts } from '../hooks/useProducts';           // Mock data
   import { useAuth } from '../hooks/useAuth';                   // Local storage
   import { useChatAnalytics } from '../hooks/useChatAnalytics'; // Local storage
   
   // With API-connected hooks
   import { useApiProducts } from '../hooks/useApiProducts';           // API connected
   import { useApiAuth } from '../hooks/useApiAuth';                   // API connected  
   import { useApiChatAnalytics } from '../hooks/useApiChatAnalytics'; // API connected
   ```

## API Endpoints Specification

### Authentication Endpoints

#### POST /api/auth/login
Login a user with email and password.

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  user: {
    name: string;
    email: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number; // seconds
}
```

#### POST /api/auth/logout
Logout the current user.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```typescript
{
  success: boolean;
  message?: string;
}
```

#### GET /api/auth/me
Get current user information.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```typescript
{
  name: string;
  email: string;
}
```

### Product Endpoints

#### GET /api/products
Get products with optional filtering, sorting, and pagination.

**Query Parameters:**
- `categories`: Comma-separated list of categories
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter  
- `minRating`: Minimum rating filter
- `sortBy`: Sort field (name, price, rating)
- `sortOrder`: Sort direction (asc, desc)
- `limit`: Number of results per page
- `offset`: Number of results to skip

**Response:**
```typescript
{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
```

#### GET /api/products/search
Search products by query with optional filters.

**Query Parameters:**
- `q`: Search query (required)
- `categories`: Comma-separated list of categories
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `minRating`: Minimum rating filter
- `limit`: Number of results
- `offset`: Number of results to skip

**Response:**
```typescript
{
  products: Product[];
}
```

#### GET /api/products/:id
Get a single product by ID.

**Response:**
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}
```

### Chat Analytics Endpoints

#### POST /api/chat/sessions
Create a new chat session.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```typescript
{
  userId: string;
}
```

**Response:**
```typescript
{
  sessionId: string;
  startTime: string; // ISO date string
}
```

#### PUT /api/chat/sessions/:id
Update an existing chat session.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```typescript
{
  sessionId: string;
  endTime?: string; // ISO date string
  metadata?: {
    messageCount: number;
    userMessageCount: number;
    botMessageCount: number;
    productInteractions: number;
    searchQueries: string[];
    categories: string[];
    avgResponseTime?: number;
  };
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

#### POST /api/chat/messages
Add a message to a chat session.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```typescript
{
  sessionId: string;
  message: {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: string; // ISO date string
    products?: Product[];
  };
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

#### GET /api/chat/analytics/:userId
Get chat analytics for a user.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```typescript
{
  totalSessions: number;
  totalMessages: number;
  averageSessionLength: number; // in minutes
  popularSearchTerms: { term: string; count: number }[];
  popularCategories: { category: string; count: number }[];
  userEngagement: {
    averageMessagesPerSession: number;
    averageSessionDuration: number; // in minutes
    productClickRate: number; // percentage
  };
}
```

#### POST /api/chat/export/:userId
Export chat data for a user.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```typescript
{
  exportUrl: string;
  expiresAt: string; // ISO date string
}
```

## Environment Configuration

Create a `.env` file in your project root:

```bash
# Backend API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api

# Optional: API timeout (default: 30000ms)
VITE_API_TIMEOUT=30000
```

## Error Handling

All API services include comprehensive error handling. Errors are thrown with descriptive messages that include:

- HTTP status code
- Error message from the server
- Request context

Example error handling in components:
```typescript
try {
  const products = await searchProducts(query);
} catch (error) {
  console.error('Search failed:', error);
  // Handle error (show toast, etc.)
}
```

## Authentication Flow

1. User submits login form
2. Frontend calls `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in sessionStorage
5. All subsequent API calls include `Authorization: Bearer {token}` header
6. On logout, frontend calls `/api/auth/logout` and clears local storage

## Data Models

### User
```typescript
interface User {
  name: string;
  email: string;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}
```

### Message
```typescript
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: Product[];
}
```

## Migration Steps

To switch from mock data to your real API:

1. Update environment variables with your API URL
2. Replace hooks in `src/pages/Index.tsx`:
   ```typescript
   // Change from:
   const { products, searchProducts, filteredProducts, filters, updateFilters } = useProducts();
   const { messages, addMessage, clearHistory } = useChatAnalytics();
   const { user, login, logout, isAuthenticated, isLoading } = useAuth();

   // To:
   const { products, searchProducts, filteredProducts, filters, updateFilters } = useApiProducts();
   const { messages, addMessage, clearHistory } = useApiChatAnalytics();
   const { user, login, logout, isAuthenticated, isLoading } = useApiAuth();
   ```

3. Test each API endpoint individually
4. Monitor browser console for any integration issues

## Testing Your Integration

1. Check browser Network tab to verify API calls are being made
2. Verify authentication tokens are being sent in headers
3. Test error scenarios (network failures, invalid credentials, etc.)
4. Ensure data persistence across browser refreshes

## Common Issues and Solutions

### CORS Issues
If you encounter CORS errors, ensure your backend includes proper CORS headers:
```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Token Expiration
Implement token refresh logic in your backend and update the `authService.refreshToken()` method.

### Rate Limiting
Consider implementing rate limiting on your API and handle 429 responses in the frontend.

This completes the backend integration setup. Your ShopMind application is now ready to connect to a real backend API!
