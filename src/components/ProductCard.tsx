
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye, Sparkles } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, compact = false }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 transition-all duration-200 ${
          i < rating 
            ? 'text-yellow-400 fill-current animate-pulse' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add cart functionality here
  };

  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm border hover:border-primary/30 ${
        compact ? 'w-full' : ''
      } ${isHovered ? 'scale-105' : ''}`}
      onClick={() => onClick(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            compact ? 'h-32' : 'h-48'
          }`}
        />
        
        {/* Overlay with Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-2 right-2 space-y-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white transition-all duration-200"
              onClick={handleLikeClick}
            >
              <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white transition-all duration-200"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          
          {!compact && (
            <div className="absolute bottom-2 left-2 right-2">
              <Button
                size="sm"
                className="w-full bg-primary/90 hover:bg-primary text-white transition-all duration-200"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm shadow-sm">
            {product.category}
          </Badge>
        </div>

        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-2 right-2 group-hover:top-14 transition-all duration-300">
            <Badge className="bg-red-500 text-white animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          </div>
        )}
      </div>

      <CardContent className={`${compact ? 'p-3' : 'p-4'} space-y-3`}>
        <h3 className={`font-semibold text-foreground mb-2 line-clamp-2 transition-colors group-hover:text-primary ${
          compact ? 'text-sm' : 'text-lg'
        }`}>
          {product.name}
        </h3>
        
        <p className={`text-muted-foreground mb-3 line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
          {product.description}
        </p>
        
        {/* Rating Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
              ({product.reviews})
            </span>
          </div>
          
          {product.rating >= 4 && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Top Rated
            </Badge>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-primary ${compact ? 'text-lg' : 'text-xl'}`}>
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className={`text-muted-foreground line-through ${compact ? 'text-xs' : 'text-sm'}`}>
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <p className="text-xs text-green-600 font-medium">
                Save ${product.originalPrice - product.price}
              </p>
            )}
          </div>
          
          {compact && (
            <Button size="sm" variant="outline" className="hover-scale transition-all duration-200">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Stock Status */}
        {product.inStock === false ? (
          <Badge variant="destructive" className="w-full justify-center animate-pulse">
            Out of Stock
          </Badge>
        ) : (
          <div className="flex items-center space-x-2 text-xs text-green-600">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>In Stock</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
