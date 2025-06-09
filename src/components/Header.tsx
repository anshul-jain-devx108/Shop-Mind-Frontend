
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Grid3X3, Menu, ShoppingBag, Home, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User as UserType } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  onViewChange: (view: 'chat' | 'products') => void;
  currentView: 'chat' | 'products';
  user?: UserType | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  onViewChange, 
  currentView,
  user,
  onLogout
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopMind
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
            
            {user && (
              <>
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={currentView === 'chat' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange('chat')}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </Button>
                  <Button
                    variant={currentView === 'products' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange('products')}
                    className="flex items-center space-x-2"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span>Products</span>
                  </Button>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground hidden md:block">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>

                {onLogout && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onLogout}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                )}
              </>
            )}

            {!user && (
              <div className="text-sm text-muted-foreground hidden md:block">
                Demo Mode
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
