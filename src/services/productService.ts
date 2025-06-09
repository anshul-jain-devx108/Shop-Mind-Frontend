
import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';
import type { Product, ProductFilters } from '../types';

export interface ProductSearchRequest {
  q: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface ProductListRequest {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductSearchResponse {
  products: Product[];
  total?: number;
}

export class ProductService {
  // Get all products with optional filtering and pagination
  async getProducts(request?: ProductListRequest): Promise<ProductListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (request?.category) {
        queryParams.append('category', request.category);
      }
      if (request?.minPrice !== undefined) {
        queryParams.append('minPrice', request.minPrice.toString());
      }
      if (request?.maxPrice !== undefined) {
        queryParams.append('maxPrice', request.maxPrice.toString());
      }
      if (request?.rating !== undefined) {
        queryParams.append('rating', request.rating.toString());
      }
      if (request?.page !== undefined) {
        queryParams.append('page', request.page.toString());
      }
      if (request?.limit !== undefined) {
        queryParams.append('limit', request.limit.toString());
      }

      const endpoint = queryParams.toString() 
        ? `${API_CONFIG.PRODUCTS.LIST}?${queryParams.toString()}`
        : API_CONFIG.PRODUCTS.LIST;
        
      return await apiClient.get<ProductListResponse>(endpoint);
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  // Search products by query
  async searchProducts(request: ProductSearchRequest): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', request.q);
      
      if (request.category) {
        queryParams.append('category', request.category);
      }
      if (request.minPrice !== undefined) {
        queryParams.append('minPrice', request.minPrice.toString());
      }
      if (request.maxPrice !== undefined) {
        queryParams.append('maxPrice', request.maxPrice.toString());
      }
      if (request.rating !== undefined) {
        queryParams.append('rating', request.rating.toString());
      }
      if (request.page !== undefined) {
        queryParams.append('page', request.page.toString());
      }
      if (request.limit !== undefined) {
        queryParams.append('limit', request.limit.toString());
      }

      const endpoint = `${API_CONFIG.PRODUCTS.SEARCH}?${queryParams.toString()}`;
      const response = await apiClient.get<ProductSearchResponse>(endpoint);
      return response.products;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProduct(productId: string): Promise<Product> {
    try {
      return await apiClient.get<Product>(API_CONFIG.PRODUCTS.DETAIL, { id: productId });
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  // Get product categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<{ categories: string[] }>(API_CONFIG.PRODUCTS.CATEGORIES);
      return response.categories;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  // Legacy method for backward compatibility with existing hooks
  async getProductsLegacy(request?: any): Promise<ProductListResponse> {
    const filters = request?.filters;
    const legacyRequest: ProductListRequest = {};
    
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        legacyRequest.category = filters.categories[0]; // Backend expects single category
      }
      if (filters.priceRange) {
        legacyRequest.minPrice = filters.priceRange[0];
        legacyRequest.maxPrice = filters.priceRange[1];
      }
      if (filters.minRating) {
        legacyRequest.rating = filters.minRating;
      }
    }
    
    if (request?.limit) legacyRequest.limit = request.limit;
    if (request?.offset && request?.limit) {
      legacyRequest.page = Math.floor(request.offset / request.limit) + 1;
    }
    
    return this.getProducts(legacyRequest);
  }
}

export const productService = new ProductService();
