
import { useState, useEffect, useMemo } from 'react';
import type { Product, ProductFilters } from '../types';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3',
    description: 'Powerful laptop with M3 chip, perfect for professionals and creators.',
    price: 2499,
    originalPrice: 2699,
    category: 'Electronics',
    image: '/placeholder.svg',
    rating: 5,
    reviews: 324,
    inStock: true,
    tags: ['laptop', 'apple', 'macbook', 'computer']
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design and advanced camera system.',
    price: 999,
    category: 'Electronics',
    image: '/placeholder.svg',
    rating: 4,
    reviews: 856,
    inStock: true,
    tags: ['smartphone', 'iphone', 'apple', 'phone']
  },
  {
    id: '3',
    name: 'Clean Code by Robert Martin',
    description: 'A handbook of agile software craftsmanship for developers.',
    price: 45,
    category: 'Books',
    image: '/placeholder.svg',
    rating: 5,
    reviews: 1205,
    inStock: true,
    tags: ['programming', 'software', 'development', 'coding']
  },
  {
    id: '4',
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air cushioning.',
    price: 150,
    originalPrice: 180,
    category: 'Clothing',
    image: '/placeholder.svg',
    rating: 4,
    reviews: 543,
    inStock: true,
    tags: ['shoes', 'nike', 'running', 'sports']
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    description: 'Premium noise-canceling wireless headphones.',
    price: 399,
    category: 'Electronics',
    image: '/placeholder.svg',
    rating: 5,
    reviews: 789,
    inStock: true,
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling']
  },
  {
    id: '6',
    name: 'JavaScript: The Definitive Guide',
    description: 'Comprehensive guide to JavaScript programming.',
    price: 59,
    category: 'Books',
    image: '/placeholder.svg',
    rating: 4,
    reviews: 432,
    inStock: true,
    tags: ['javascript', 'programming', 'web development']
  }
];

export const useProducts = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    priceRange: [0, 2000],
    minRating: 0
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = filters.categories.length === 0 || 
                            filters.categories.includes(product.category);
      const matchesPrice = product.price >= filters.priceRange[0] && 
                          product.price <= filters.priceRange[1];
      const matchesRating = product.rating >= filters.minRating;
      
      return matchesCategory && matchesPrice && matchesRating;
    });
  }, [products, filters]);

  const searchProducts = async (query: string): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return products.filter(product => {
      const searchableText = `${product.name} ${product.description} ${product.category} ${product.tags.join(' ')}`.toLowerCase();
      
      return searchTerms.some(term => searchableText.includes(term));
    });
  };

  const updateFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  return {
    products,
    filteredProducts,
    filters,
    searchProducts,
    updateFilters
  };
};
