
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { Product } from '../types';

interface ProductFilters {
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export const useApiProducts = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Get products query
  const productsQuery = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts({
      category: filters.categories.length > 0 ? filters.categories[0] : undefined, // Use first category
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      rating: filters.minRating,
      limit: 50
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Search products query
  const searchQuery_ = useQuery({
    queryKey: ['products', 'search', searchQuery, filters],
    queryFn: async () => {
      const searchResults = await productService.searchProducts({
        q: searchQuery,
        category: filters.categories.length > 0 ? filters.categories[0] : undefined, // Use first category
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.minRating,
        limit: 50
      });
      return { products: searchResults }; // Wrap in object to match expected structure
    },
    enabled: !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const products = searchQuery ? (searchQuery_.data?.products || []) : (productsQuery.data?.products || []);
  const isLoading = searchQuery ? searchQuery_.isLoading : productsQuery.isLoading;
  const error = searchQuery ? searchQuery_.error : productsQuery.error;

  const searchProducts = async (query: string) => {
    setSearchQuery(query);
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredProducts = products; // Server-side filtering

  // Get categories query
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    products,
    filteredProducts,
    searchProducts,
    filters,
    updateFilters,
    categories: categoriesQuery.data || [],
    isLoading,
    error,
    isLoadingCategories: categoriesQuery.isLoading
  };
};
