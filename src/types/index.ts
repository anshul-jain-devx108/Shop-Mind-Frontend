
export interface Product {
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

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: Product[];
}

export interface User {
  name: string;
  email: string;
}

export interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
}
