
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RotateCcw, MessageSquare, TrendingUp, Star, Loader2 } from 'lucide-react';
import type { ProductFilters } from '../types';

interface SidebarProps {
  isOpen: boolean;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearHistory: () => void;
  messageCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  filters, 
  onFiltersChange, 
  onClearHistory, 
  messageCount
}) => {
  const [isClearing, setIsClearing] = useState(false);

  const handlePriceChange = (value: number[]) => {
    // Ensure we always have exactly 2 elements for the tuple
    const priceRange: [number, number] = [value[0] || 0, value[1] || 2000];
    onFiltersChange({ ...filters, priceRange });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, minRating: rating });
  };

  const handleClearHistory = async () => {
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Animation delay
    onClearHistory();
    setIsClearing(false);
  };

  const categories = ['Electronics', 'Books', 'Clothing', 'Home & Garden', 'Sports'];

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white/95 backdrop-blur-md border-r border-border transition-all duration-300 z-40 shadow-xl ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 h-full overflow-y-auto">
        {/* Enhanced Chat History */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-primary/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chat Session
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
                  {messageCount}
                </Badge>
                <span className="text-sm text-muted-foreground">Messages</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                disabled={isClearing}
                className="flex items-center space-x-1 hover-scale transition-all duration-200 hover:bg-red-50 hover:border-red-200"
              >
                {isClearing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RotateCcw className="h-3 w-3" />
                )}
                <span>{isClearing ? 'Clearing...' : 'Clear'}</span>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground bg-white/60 rounded p-2">
              📅 Session started: {new Date().toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        {/* Enhanced Filters */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Price Range */}
            <div className="space-y-3">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <span>💰 Price Range</span>
              </h4>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceChange}
                  max={2000}
                  min={0}
                  step={50}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-muted-foreground font-medium">
                  <span className="bg-white px-2 py-1 rounded shadow-sm">${filters.priceRange[0]}</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Enhanced Categories */}
            <div className="space-y-3">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <span>🏷️ Categories</span>
                <Badge variant="outline" className="text-xs">
                  {filters.categories.length} selected
                </Badge>
              </h4>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked as boolean)
                      }
                      className="transition-all duration-200"
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {category}
                    </label>
                    {filters.categories.includes(category) && (
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Enhanced Rating */}
            <div className="space-y-3">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <span>⭐ Minimum Rating</span>
              </h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.minRating === rating ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleRatingChange(rating)}
                    className="w-full justify-start hover-scale transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: rating }, (_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current text-yellow-400 group-hover:animate-pulse" />
                        ))}
                      </div>
                      <span className="ml-2">& up</span>
                      {filters.minRating === rating && (
                        <div className="ml-auto">
                          <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};
